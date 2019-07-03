module Api exposing
    ( ProfileUpdateData
    , SellProductRequest(..)
    , SignUpRequest
    , Token
    , UpdateProductRequest(..)
    , deleteProduct
    , getBoughtProductList
    , getCommentedProductList
    , getFreeProductList
    , getHistoryViewProducts
    , getLikedProducts
    , getMyNameAndLikedProductsId
    , getProduct
    , getProductComments
    , getRecentProductList
    , getRecommendProductList
    , getSoldProductList
    , getTradeComment
    , getTradedProductList
    , getTradingProductList
    , getUserProfile
    , likeProduct
    , logInOrSignUpUrlRequest
    , markProductInHistory
    , postProductComment
    , sellProduct
    , sendConfirmEmail
    , tokenFromString
    , tokenRefresh
    , tokenToString
    , tradeStart
    , unlikeProduct
    , updateProduct
    , updateProfile
    , userWithNameDecoder
    )

import Data.Category as Category
import Data.EmailAddress as EmailAddress
import Data.ImageId as ImageId
import Data.Product as Product
import Data.SocialLoginService
import Data.Trade as Trade
import Data.University as University
import Data.User as User
import Http
import Json.Decode as Jd
import Json.Decode.Pipeline as Jdp
import Json.Encode as Je
import Set
import Time
import Url



{- ========================================================================
                  ユーザー情報を登録して認証メールを送信
   ========================================================================
-}


{-| 新規登録に必要な情報。この内容をサーバーに送信する
-}
type alias SignUpRequest =
    { sendEmailToken : String
    , emailAddress : EmailAddress.EmailAddress
    , image : Maybe String
    , university : University.University
    , displayName : String
    }


sendConfirmEmail : SignUpRequest -> (Result String () -> msg) -> Cmd msg
sendConfirmEmail { sendEmailToken, displayName, image, university, emailAddress } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "sendConformEmail"
                , args =
                    [ ( "sendEmailToken", GraphQLString sendEmailToken )
                    , ( "displayName", GraphQLString displayName )
                    , ( "image"
                      , case image of
                            Just dataUrl ->
                                GraphQLString dataUrl

                            Nothing ->
                                GraphQLNull
                      )
                    , ( "university", universityToGraphQLValue university )
                    , ( "email", GraphQLString (EmailAddress.toString emailAddress) )
                    ]
                , return = []
                }
            ]
        )
        sendConfirmEmailRequestBody
        callBack


universityToGraphQLValue : University.University -> GraphQLValue
universityToGraphQLValue university =
    GraphQLObject
        (case university of
            University.GraduateTsukuba graduate schoolAndDepartment ->
                [ ( "graduate", GraphQLEnum (University.graduateToIdString graduate) )
                , ( "schoolAndDepartment", GraphQLEnum (University.departmentToIdString schoolAndDepartment) )
                ]

            University.GraduateNoTsukuba graduate ->
                [ ( "graduate", GraphQLEnum (University.graduateToIdString graduate) ) ]

            University.NotGraduate schoolAndDepartment ->
                [ ( "schoolAndDepartment", GraphQLEnum (University.departmentToIdString schoolAndDepartment) ) ]
        )


{-| 新規登録のJSONを生成
-}
sendConfirmEmailRequestBody : Jd.Decoder ()
sendConfirmEmailRequestBody =
    Jd.field "sendConformEmail"
        Jd.string
        |> Jd.andThen
            (\result ->
                if result == "ok" then
                    Jd.succeed ()

                else
                    Jd.fail "okでなかった"
            )


{-| アクセストークンやリフレッシュトークン
-}
type Token
    = Token String


tokenFromString : String -> Token
tokenFromString =
    Token


tokenToString : Token -> String
tokenToString (Token string) =
    string



{- =================================================
                   Tokenの更新
   =================================================
-}


tokenRefresh : { refresh : Token } -> (Result String { accessToken : Token, refreshToken : Token } -> msg) -> Cmd msg
tokenRefresh { refresh } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getAccessTokenAndUpdateRefreshToken"
                , args = [ ( "refreshToken", GraphQLString (tokenToString refresh) ) ]
                , return =
                    [ Field { name = "refreshToken", args = [], return = [] }
                    , Field { name = "accessToken", args = [], return = [] }
                    ]
                }
            ]
        )
        (Jd.field "getAccessTokenAndUpdateRefreshToken"
            (Jd.succeed
                (\refreshToken accessToken ->
                    { accessToken = tokenFromString accessToken
                    , refreshToken = tokenFromString refreshToken
                    }
                )
                |> Jdp.required "refreshToken" Jd.string
                |> Jdp.required "accessToken" Jd.string
            )
        )
        callBack


getMyNameAndLikedProductsId : Token -> (Result String ( User.WithName, List Product.Id ) -> msg) -> Cmd msg
getMyNameAndLikedProductsId token callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
                , return =
                    [ Field { name = "id", args = [], return = [] }
                    , Field { name = "displayName", args = [], return = [] }
                    , Field { name = "imageId", args = [], return = [] }
                    , Field
                        { name = "likedProductAll"
                        , args = []
                        , return =
                            [ Field { name = "id", args = [], return = [] } ]
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            profileAndLikedProductsIdDecoder
        )
        callBack


profileAndLikedProductsIdDecoder : Jd.Decoder ( User.WithName, List Product.Id )
profileAndLikedProductsIdDecoder =
    Jd.succeed
        (\id displayName imageId likedProductIds ->
            ( User.withNameFromApi
                { id = id
                , displayName = displayName
                , imageId = imageId
                }
            , likedProductIds |> List.map Product.idFromString
            )
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "displayName" Jd.string
        |> Jdp.required "imageId" imageIdDecoder
        |> Jdp.required "likedProductAll"
            (Jd.list
                (Jd.field "id" Jd.string)
            )


userWithNameReturn : List Field
userWithNameReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field { name = "displayName", args = [], return = [] }
    , Field { name = "imageId", args = [], return = [] }
    ]


userWithNameDecoder : Jd.Decoder User.WithName
userWithNameDecoder =
    Jd.succeed
        (\id displayName imageId ->
            User.withNameFromApi
                { id = id
                , displayName = displayName
                , imageId = imageId
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "displayName" Jd.string
        |> Jdp.required "imageId" imageIdDecoder


userWithProfileReturn : List Field
userWithProfileReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field { name = "displayName", args = [], return = [] }
    , Field { name = "imageId", args = [], return = [] }
    , Field { name = "introduction", args = [], return = [] }
    , Field
        { name = "university"
        , args = []
        , return =
            [ Field { name = "schoolAndDepartment", args = [], return = [] }
            , Field { name = "graduate", args = [], return = [] }
            ]
        }
    ]


userWithProfileDecoder : Jd.Decoder User.WithProfile
userWithProfileDecoder =
    Jd.succeed
        (\id displayName imageId introduction schoolAndDepartment graduate ->
            User.withProfileFromApi
                { id = id
                , displayName = displayName
                , imageId = imageId
                , introduction = introduction
                , university =
                    University.universityFromIdString
                        { graduateMaybe = graduate, departmentMaybe = schoolAndDepartment }
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "displayName" Jd.string
        |> Jdp.required "imageId" imageIdDecoder
        |> Jdp.required "introduction" Jd.string
        |> Jdp.requiredAt
            [ "university", "schoolAndDepartment" ]
            (Jd.nullable Jd.string)
        |> Jdp.requiredAt
            [ "university", "graduate" ]
            (Jd.nullable Jd.string)
        |> Jd.andThen
            (\userMaybe ->
                case userMaybe of
                    Just user ->
                        Jd.succeed user

                    Nothing ->
                        Jd.fail "invalid university"
            )


imageIdDecoder : Jd.Decoder ImageId.ImageId
imageIdDecoder =
    Jd.string
        |> Jd.map (\string -> ImageId.fromString string)



{- ==================================================================
                                出品
   ==================================================================
-}


type SellProductRequest
    = SellProductRequest
        { name : String
        , description : String
        , price : Int
        , condition : Product.Condition
        , category : Category.Category
        , images : List String
        }


sellProduct : Token -> SellProductRequest -> (Result String Product.ProductDetail -> msg) -> Cmd msg
sellProduct token (SellProductRequest request) callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "sellProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "name", GraphQLString request.name )
                    , ( "price", GraphQLInt request.price )
                    , ( "description", GraphQLString request.description )
                    , ( "images", GraphQLList (request.images |> List.map GraphQLString) )
                    , ( "condition", GraphQLEnum (Product.conditionToIdString request.condition) )
                    , ( "category", GraphQLEnum (Category.toIdString request.category) )
                    ]
                , return = productDetailReturn
                }
            ]
        )
        (Jd.field "sellProduct" productDetailDecoder)
        callBack


productReturn : List Field
productReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field { name = "name", args = [], return = [] }
    , Field { name = "price", args = [], return = [] }
    , Field { name = "category", args = [], return = [] }
    , Field { name = "status", args = [], return = [] }
    , Field { name = "thumbnailImageId", args = [], return = [] }
    , Field { name = "likedCount", args = [], return = [] }
    ]


productDecoder : Jd.Decoder Product.Product
productDecoder =
    Jd.succeed
        (\id name price category status thumbnailImageId likedCount ->
            Product.fromApi
                { id = id
                , name = name
                , price = price
                , category = category
                , status = status
                , thumbnailImageId = thumbnailImageId
                , likedCount = likedCount
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "name" Jd.string
        |> Jdp.required "price" Jd.int
        |> Jdp.required "category" categoryDecoder
        |> Jdp.required "status" statusDecoder
        |> Jdp.required "thumbnailImageId" imageIdDecoder
        |> Jdp.required "likedCount" Jd.int


productDetailReturn : List Field
productDetailReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field { name = "name", args = [], return = [] }
    , Field { name = "description", args = [], return = [] }
    , Field { name = "price", args = [], return = [] }
    , Field { name = "condition", args = [], return = [] }
    , Field { name = "category", args = [], return = [] }
    , Field { name = "status", args = [], return = [] }
    , Field { name = "imageIds", args = [], return = [] }
    , Field { name = "likedCount", args = [], return = [] }
    , Field
        { name = "seller"
        , args = []
        , return = userWithNameReturn
        }
    , Field { name = "createdAt", args = [], return = [] }
    ]


productDetailDecoder : Jd.Decoder Product.ProductDetail
productDetailDecoder =
    Jd.succeed
        (\id name description price condition category status imageIds likedCount seller createdAt ->
            Product.detailFromApi
                { id = id
                , name = name
                , description = description
                , price = price
                , condition = condition
                , category = category
                , status = status
                , imageIds = imageIds
                , likedCount = likedCount
                , seller = seller
                , createdAt = createdAt
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "name" Jd.string
        |> Jdp.required "description" Jd.string
        |> Jdp.required "price" Jd.int
        |> Jdp.required "condition" conditionDecoder
        |> Jdp.required "category" categoryDecoder
        |> Jdp.required "status" statusDecoder
        |> Jdp.required "imageIds" imageIdsDecoder
        |> Jdp.required "likedCount" Jd.int
        |> Jdp.required "seller" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder


conditionDecoder : Jd.Decoder Product.Condition
conditionDecoder =
    Jd.string
        |> Jd.andThen
            (\idString ->
                case Product.conditionFromIdString idString of
                    Just condition ->
                        Jd.succeed condition

                    Nothing ->
                        Jd.fail
                            (enumErrorMsg
                                idString
                                "condition"
                                Product.conditionAll
                                Product.conditionToIdString
                            )
            )


categoryDecoder : Jd.Decoder Category.Category
categoryDecoder =
    Jd.string
        |> Jd.andThen
            (\idString ->
                case Category.fromIdString idString of
                    Just category ->
                        Jd.succeed category

                    Nothing ->
                        Jd.fail
                            (enumErrorMsg
                                idString
                                "category"
                                Category.all
                                Category.toIdString
                            )
            )


statusDecoder : Jd.Decoder Product.Status
statusDecoder =
    Jd.string
        |> Jd.andThen
            (\idString ->
                case Product.statusFromIdString idString of
                    Just status ->
                        Jd.succeed status

                    Nothing ->
                        Jd.fail
                            (enumErrorMsg
                                idString
                                "status"
                                Product.statusAll
                                Product.statusToIdString
                            )
            )


imageIdsDecoder : Jd.Decoder ( ImageId.ImageId, List ImageId.ImageId )
imageIdsDecoder =
    Jd.list Jd.string
        |> Jd.andThen
            (\list ->
                case list of
                    [] ->
                        Jd.fail "imageIds length is 0"

                    x :: xs ->
                        Jd.succeed ( ImageId.fromString x, xs |> List.map ImageId.fromString )
            )


enumErrorMsg : String -> String -> List a -> (a -> String) -> String
enumErrorMsg idString idName all toString =
    "I can't understand \""
        ++ idString
        ++ "\" in "
        ++ idName
        ++ "."
        ++ "expect \""
        ++ (all |> List.map toString |> String.join "\" or \"")
        ++ "\"."



{- ==============================================================================
                          商品の情報を編集する
   ==============================================================================
-}


type UpdateProductRequest
    = UpdateProductRequest
        { name : String
        , description : String
        , price : Int
        , condition : Product.Condition
        , addImageList : List String
        , deleteImageIndex : Set.Set Int
        }


updateProduct : Token -> Product.Id -> UpdateProductRequest -> (Result String () -> msg) -> Cmd msg
updateProduct accessToken productId editProductRequest callBack =
    Cmd.none



{- ============================================================
                   自分のプロフィールを更新する
   ============================================================
-}


type alias ProfileUpdateData =
    { displayName : String
    , introduction : String
    , image : Maybe String
    , university : University.University
    }


updateProfile : Token -> ProfileUpdateData -> (Result String User.WithProfile -> msg) -> Cmd msg
updateProfile accessToken { displayName, introduction, image, university } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "updateProfile"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "displayName", GraphQLString displayName )
                    , ( "image", nullableGraphQLValue GraphQLString image )
                    , ( "introduction", GraphQLString introduction )
                    , ( "university", universityToGraphQLValue university )
                    ]
                , return = userWithProfileReturn
                }
            ]
        )
        (Jd.field "updateProfile"
            userWithProfileDecoder
        )
        callBack



{- ============================================================
                   自分がいいねした商品を取得する
   ============================================================
-}


getLikedProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getLikedProducts accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "likedProductAll"
                        , args = []
                        , return = productReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "likedProductAll" (Jd.list productDecoder))
        )
        callBack



{- ============================================================
                    自分が閲覧した商品を取得
   ============================================================
-}


getHistoryViewProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getHistoryViewProducts accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "historyViewProductAll"
                        , args = []
                        , return = productReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "historyViewProductAll" (Jd.list productDecoder))
        )
        callBack



{- ============================================================
                    出品した商品を取得する
   ============================================================
-}


getSoldProductList : User.Id -> (Result String (List Product.Product) -> msg) -> Cmd msg
getSoldProductList userId callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "user"
                , args = [ ( "userId", GraphQLString (User.idToString userId) ) ]
                , return =
                    [ Field
                        { name = "soldProductAll"
                        , args = []
                        , return = productReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "user"
            (Jd.field "soldProductAll" (Jd.list productDecoder))
        )
        callBack



{- ============================================================
               自分が購入した商品を取得する
   ============================================================
-}


getBoughtProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getBoughtProductList accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "boughtProductAll"
                        , args = []
                        , return = productReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "boughtProductAll" (Jd.list productDecoder))
        )
        callBack



{- ============================================================
                      取引中の取引の取得する
   ============================================================
-}


getTradingProductList : Token -> (Result String (List Trade.Trade) -> msg) -> Cmd msg
getTradingProductList accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "tradingAll"
                        , args = []
                        , return = tradeReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "tradingAll" (Jd.list tradeDecoder))
        )
        callBack


tradeReturn : List Field
tradeReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field
        { name = "product"
        , args = []
        , return =
            productReturn
                ++ [ Field
                        { name = "seller", args = [], return = userWithNameReturn }
                   ]
        }
    , Field { name = "buyer", args = [], return = userWithNameReturn }
    , Field { name = "createdAt", args = [], return = [] }
    , Field { name = "updateAt", args = [], return = [] }
    ]


tradeDecoder : Jd.Decoder Trade.Trade
tradeDecoder =
    Jd.succeed
        (\id product seller buyer createdAt updateAt ->
            Trade.fromApi
                { id = id
                , product = product
                , seller = seller
                , buyer = buyer
                , createdAt = createdAt
                , updateAt = updateAt
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "product" productDecoder
        |> Jdp.requiredAt [ "product", "seller" ] userWithNameDecoder
        |> Jdp.required "buyer" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder
        |> Jdp.required "updateAt" dateTimeDecoder



{- ============================================================
                      取引したの取引の取得する
   ============================================================
-}


getTradedProductList : Token -> (Result String (List Trade.Trade) -> msg) -> Cmd msg
getTradedProductList accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "tradedAll"
                        , args = []
                        , return = tradeReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "tradedAll" (Jd.list tradeDecoder))
        )
        callBack



{- ============================================================
               自分がコメントした商品を取得する
   ============================================================
-}


getCommentedProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getCommentedProductList accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field
                        { name = "commentedProductAll"
                        , args = []
                        , return = productReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "commentedProductAll" (Jd.list productDecoder))
        )
        callBack



{- ============================================================
                ユーザーのプロフィールを取得する
   ============================================================
-}


getUserProfile : User.Id -> (Result String User.WithProfile -> msg) -> Cmd msg
getUserProfile userId callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "user"
                , args = [ ( "userId", GraphQLString (User.idToString userId) ) ]
                , return = userWithProfileReturn
                }
            ]
        )
        (Jd.field "user"
            userWithProfileDecoder
        )
        callBack



{- ==============================================================
                           新着の商品を取得
   ==============================================================
-}


getRecentProductList : (Result String (List Product.Product) -> msg) -> Cmd msg
getRecentProductList callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "productRecentAll"
                , args = []
                , return = productReturn
                }
            ]
        )
        (Jd.field "productRecentAll"
            (Jd.list productDecoder)
        )
        callBack



{- ==============================================================
                      おすすめの商品を取得
   ==============================================================
-}


getRecommendProductList : (Result String (List Product.Product) -> msg) -> Cmd msg
getRecommendProductList callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "productRecommendAll"
                , args = []
                , return = productReturn
                }
            ]
        )
        (Jd.field "productRecommendAll"
            (Jd.list productDecoder)
        )
        callBack



{- ==============================================================
                        0円の商品を取得
   ==============================================================
-}


getFreeProductList : (Result String (List Product.Product) -> msg) -> Cmd msg
getFreeProductList callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "productFreeAll"
                , args = []
                , return = productReturn
                }
            ]
        )
        (Jd.field "productFreeAll"
            (Jd.list productDecoder)
        )
        callBack



{- ==============================================================================
                              商品の情報を取得
   ==============================================================================
-}


getProduct : Product.Id -> (Result String Product.ProductDetail -> msg) -> Cmd msg
getProduct id callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "product"
                , args = [ ( "productId", GraphQLString (Product.idToString id) ) ]
                , return = productDetailReturn
                }
            ]
        )
        (Jd.field "product" productDetailDecoder)
        callBack



{- ==============================================================================
                              商品を削除する
   ==============================================================================
-}


deleteProduct : Token -> Product.Id -> Cmd msg
deleteProduct token productId =
    Cmd.none



{- ==============================================================================
                              商品を閲覧履歴に追加する
   ==============================================================================
-}


markProductInHistory : Token -> Product.Id -> (Result String Product.ProductDetail -> msg) -> Cmd msg
markProductInHistory accessToken productId callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "markProductInHistory"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = productDetailReturn
                }
            ]
        )
        (Jd.field "markProductInHistory" productDetailDecoder)
        callBack



{- ==============================================================================
                              商品にいいねをする
   ==============================================================================
-}


likeProduct : Token -> Product.Id -> (Result String Int -> msg) -> Cmd msg
likeProduct accessToken productId callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "likeProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = productOnlyLikeCountReturn
                }
            ]
        )
        (Jd.field "likeProduct" productOnlyLikeCountDecoder)
        callBack


productOnlyLikeCountReturn : List Field
productOnlyLikeCountReturn =
    [ Field
        { name = "likedCount", args = [], return = [] }
    ]


productOnlyLikeCountDecoder : Jd.Decoder Int
productOnlyLikeCountDecoder =
    Jd.field "likedCount" Jd.int



{- ==============================================================================
                              商品のいいねをはずす
   ==============================================================================
-}


unlikeProduct : Token -> Product.Id -> (Result String Int -> msg) -> Cmd msg
unlikeProduct accessToken productId callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "unlikeProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = productOnlyLikeCountReturn
                }
            ]
        )
        (Jd.field "unlikeProduct" productOnlyLikeCountDecoder)
        callBack



{- ==============================================================================
                          商品のコメントを取得する
   ==============================================================================
-}


getProductComments : Product.Id -> (Result String (List Product.Comment) -> msg) -> Cmd msg
getProductComments productId callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "product"
                , args = [ ( "productId", GraphQLString (Product.idToString productId) ) ]
                , return =
                    [ Field
                        { name = "comments"
                        , args = []
                        , return = productCommentReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "product"
            (Jd.field "comments"
                (Jd.list productCommentDecoder)
            )
        )
        callBack


productCommentReturn : List Field
productCommentReturn =
    [ Field { name = "body", args = [], return = [] }
    , Field { name = "speaker", args = [], return = userWithNameReturn }
    , Field { name = "createdAt", args = [], return = [] }
    ]


productCommentDecoder : Jd.Decoder Product.Comment
productCommentDecoder =
    Jd.succeed
        (\body speaker createdAt ->
            Product.commentFromApi
                { body = body
                , speaker = speaker
                , createdAt = createdAt
                }
        )
        |> Jdp.required "body" Jd.string
        |> Jdp.required "speaker" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder



{- ==============================================================================
                              商品にコメントをする
   ==============================================================================
-}


postProductComment :
    Token
    -> Product.Id
    -> String
    -> (Result String (List Product.Comment) -> msg)
    -> Cmd msg
postProductComment accessToken productId commentBody callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "addCommentProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    , ( "body", GraphQLString commentBody )
                    ]
                , return =
                    [ Field
                        { name = "comments"
                        , args = []
                        , return = productCommentReturn
                        }
                    ]
                }
            ]
        )
        (Jd.field "addCommentProduct"
            (Jd.field "comments"
                (Jd.list productCommentDecoder)
            )
        )
        callBack


dateTimeDecoder : Jd.Decoder Time.Posix
dateTimeDecoder =
    Jd.float
        |> Jd.map (floor >> Time.millisToPosix)



{- ==============================================================================
                              商品の取引を開始する
   ==============================================================================
-}


tradeStart : Token -> Product.Id -> (Result String () -> msg) -> Cmd msg
tradeStart token productId msg =
    Cmd.none


tradeStartResponseToResult : Http.Response String -> Result () ()
tradeStartResponseToResult response =
    case response of
        Http.GoodStatus_ _ _ ->
            Ok ()

        _ ->
            Err ()



{- ==============================================================================
                      商品の取引のコメントを取得する
   ==============================================================================
-}


getTradeComment : Token -> Product.Id -> (Result () (List Product.Comment) -> msg) -> Cmd msg
getTradeComment token productId msg =
    Cmd.none



{- ==============================================================================
                         ソーシャルログインでログイン/新規登録
   ==============================================================================
-}


logInOrSignUpUrlRequest : Data.SocialLoginService.SocialLoginService -> (Result String Url.Url -> msg) -> Cmd msg
logInOrSignUpUrlRequest service callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getLogInUrl"
                , args =
                    [ ( "service"
                      , GraphQLEnum
                            (case service of
                                Data.SocialLoginService.Google ->
                                    "google"

                                Data.SocialLoginService.GitHub ->
                                    "gitHub"

                                Data.SocialLoginService.Twitter ->
                                    "twitter"

                                Data.SocialLoginService.Line ->
                                    "line"
                            )
                      )
                    ]
                , return = []
                }
            ]
        )
        logInOrSignUpUrlResponseToResult
        callBack


logInOrSignUpUrlResponseToResult : Jd.Decoder Url.Url
logInOrSignUpUrlResponseToResult =
    Jd.field "getLogInUrl" Jd.string
        |> Jd.andThen
            (\urlString ->
                case Url.fromString urlString of
                    Just url ->
                        Jd.succeed url

                    Nothing ->
                        Jd.fail "url"
            )



{- ==============================================================================
                              Graph QL Api Request
   ==============================================================================
-}


type Query
    = Mutation (List Field)
    | Query (List Field)


type Field
    = Field
        { name : String
        , args : List ( String, GraphQLValue )
        , return : List Field
        }


type GraphQLValue
    = GraphQLString String
    | GraphQLEnum String
    | GraphQLInt Int
    | GraphQLFloat Float
    | GraphQLObject (List ( String, GraphQLValue ))
    | GraphQLList (List GraphQLValue)
    | GraphQLNull


graphQlApiRequest : Query -> Jd.Decoder a -> (Result String a -> msg) -> Cmd msg
graphQlApiRequest query responseDecoder callBack =
    Http.post
        { url = "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api"
        , body = graphQlRequestBody (queryToString query)
        , expect = Http.expectStringResponse callBack (graphQlResponseDecoder responseDecoder)
        }


queryToString : Query -> String
queryToString query =
    case query of
        Mutation fieldList ->
            "mutation {\n" ++ (fieldList |> List.map fieldToString |> String.join "\n") ++ "}"

        Query fieldList ->
            "{\n" ++ (fieldList |> List.map fieldToString |> String.join "\n") ++ "}"


fieldToString : Field -> String
fieldToString (Field { name, args, return }) =
    name
        ++ (if args == [] then
                ""

            else
                "("
                    ++ (args
                            |> List.map (\( argsName, argsValue ) -> argsName ++ ": " ++ graphQLValueToString argsValue)
                            |> String.join ", "
                       )
                    ++ ")"
           )
        ++ (if return == [] then
                ""

            else
                " {\n" ++ (return |> List.map fieldToString |> String.join "\n") ++ "\n}"
           )


graphQLValueToString : GraphQLValue -> String
graphQLValueToString graphQLValue =
    case graphQLValue of
        GraphQLString string ->
            string |> Je.string |> Je.encode 0

        GraphQLEnum string ->
            string

        GraphQLInt int ->
            String.fromInt int

        GraphQLFloat float ->
            String.fromFloat float

        GraphQLObject object ->
            "{"
                ++ (object
                        |> List.map (\( argsName, argsValue ) -> argsName ++ ": " ++ graphQLValueToString argsValue)
                        |> String.join ", "
                   )
                ++ "}"

        GraphQLList list ->
            "["
                ++ (list |> List.map graphQLValueToString |> String.join ", ")
                ++ "]"

        GraphQLNull ->
            "null"


nullableGraphQLValue : (a -> GraphQLValue) -> Maybe a -> GraphQLValue
nullableGraphQLValue func maybe =
    case maybe of
        Just a ->
            func a

        Nothing ->
            GraphQLNull


graphQlRequestBody : String -> Http.Body
graphQlRequestBody queryOrMutation =
    Http.jsonBody
        (Je.object
            [ ( "query"
              , Je.string queryOrMutation
              )
            ]
        )


graphQlResponseDecoder : Jd.Decoder a -> Http.Response String -> Result String a
graphQlResponseDecoder decoder response =
    case response of
        Http.BadUrl_ _ ->
            Err "BadURL"

        Http.Timeout_ ->
            Err "Timeout"

        Http.NetworkError_ ->
            Err "NetworkError"

        Http.BadStatus_ _ body ->
            body
                |> Jd.decodeString graphQLErrorResponseDecoder
                |> (\result ->
                        case result of
                            Ok errMsg ->
                                Err errMsg

                            Err decodeError ->
                                Err
                                    [ "ElmのJSONデコーダーのエラー「"
                                        ++ Jd.errorToString decodeError
                                        ++ "」"
                                    ]
                   )
                |> Result.mapError (String.join ",\n")

        Http.GoodStatus_ _ body ->
            body
                |> Jd.decodeString
                    (Jd.field "data"
                        decoder
                    )
                |> Result.mapError Jd.errorToString


graphQLErrorResponseDecoder : Jd.Decoder (List String)
graphQLErrorResponseDecoder =
    Jd.field "errors"
        (Jd.list
            (Jd.succeed
                (\message lineAndColumnList ->
                    "message"
                        ++ message
                        ++ " at "
                        ++ (lineAndColumnList
                                |> List.map
                                    (\( line, column ) ->
                                        String.fromInt line ++ ":" ++ String.fromInt column
                                    )
                                |> String.join ","
                           )
                )
                |> Jdp.required "message" Jd.string
                |> Jdp.required "locations"
                    (Jd.list
                        (Jd.succeed Tuple.pair
                            |> Jdp.required "line" Jd.int
                            |> Jdp.required "column" Jd.int
                        )
                    )
            )
        )
