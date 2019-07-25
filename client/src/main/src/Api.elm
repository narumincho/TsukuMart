module Api exposing
    ( ProfileUpdateData
    , SellProductRequest(..)
    , SignUpRequest
    , Token
    , UpdateProductRequest(..)
    , addProductComment
    , addTradeComment
    , cancelTrade
    , deleteProduct
    , finishTrade
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
    , getTradeDetail
    , getTradedProductList
    , getTradingProductList
    , getUserProfile
    , likeProduct
    , logInOrSignUpUrlRequest
    , makeToken
    , markProductInHistory
    , registerSignUpData
    , sellProduct
    , startTrade
    , tokenGetRefreshTokenAsString
    , tokenRefresh
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
import Task
import Time
import Url



{- ========================================================================
                  ユーザー情報を登録して認証メールを送信
   ========================================================================
-}


{-| 新規登録に必要な情報。この内容をサーバーに送信する
-}
type alias SignUpRequest =
    { emailAddress : EmailAddress.EmailAddress
    , image : Maybe String
    , university : University.University
    , displayName : String
    }


registerSignUpData : String -> SignUpRequest -> (Result String String -> msg) -> Cmd msg
registerSignUpData sendEmailToken { displayName, image, university, emailAddress } callBack =
    graphQlApiRequestWithoutToken
        (Mutation
            [ Field
                { name = "registerSignUpData"
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
        Jd.string
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


{-| アクセストークンとリフレッシュトークン
-}
type Token
    = Token
        { refresh : String
        , access : String
        }


makeToken : { accessToken : String, refreshToken : String } -> Token
makeToken { accessToken, refreshToken } =
    Token
        { refresh = refreshToken
        , access = accessToken
        }


tokenGetAccessTokenAsString : Token -> String
tokenGetAccessTokenAsString (Token { access }) =
    access


tokenGetRefreshTokenAsString : Token -> String
tokenGetRefreshTokenAsString (Token { refresh }) =
    refresh



{- =================================================
                   Tokenの更新
   =================================================
-}


tokenRefresh : String -> (Result String Token -> msg) -> Cmd msg
tokenRefresh accessToken callBack =
    graphQlTokenRefreshTask accessToken
        |> Task.attempt callBack



{- =================================================
          自分のプロフィールといいねした商品の取得
   =================================================
-}


getMyNameAndLikedProductsId : Token -> (Result String ( User.WithName, List Product.Id ) -> msg) -> Cmd msg
getMyNameAndLikedProductsId =
    graphQlApiRequestWithToken
        (\t ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString t) ) ]
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


sellProduct : SellProductRequest -> Token -> (Result String Product.ProductDetail -> msg) -> Cmd msg
sellProduct (SellProductRequest request) =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "sellProduct"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
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
        |> Jdp.required "status" productStatusDecoder
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
        |> Jdp.required "status" productStatusDecoder
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


productStatusDecoder : Jd.Decoder Product.Status
productStatusDecoder =
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


updateProfile : ProfileUpdateData -> Token -> (Result String User.WithProfile -> msg) -> Cmd msg
updateProfile { displayName, introduction, image, university } =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "updateProfile"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
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



{- ============================================================
                   自分がいいねした商品を取得する
   ============================================================
-}


getLikedProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getLikedProducts =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
                    自分が閲覧した商品を取得
   ============================================================
-}


getHistoryViewProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getHistoryViewProducts =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
                    出品した商品を取得する
   ============================================================
-}


getSoldProductList : User.Id -> (Result String (List Product.Product) -> msg) -> Cmd msg
getSoldProductList userId callBack =
    graphQlApiRequestWithoutToken
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
getBoughtProductList =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
                      取引中の取引の取得する
   ============================================================
-}


getTradingProductList : Token -> (Result String (List Trade.Trade) -> msg) -> Cmd msg
getTradingProductList =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
                      取引した取引を取得する
   ============================================================
-}


getTradedProductList : Token -> (Result String (List Trade.Trade) -> msg) -> Cmd msg
getTradedProductList =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
               自分がコメントした商品を取得する
   ============================================================
-}


getCommentedProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getCommentedProductList =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "userPrivate"
                    , args = [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) ) ]
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



{- ============================================================
                ユーザーのプロフィールを取得する
   ============================================================
-}


getUserProfile : User.Id -> (Result String User.WithProfile -> msg) -> Cmd msg
getUserProfile userId callBack =
    graphQlApiRequestWithoutToken
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
    graphQlApiRequestWithoutToken
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
    graphQlApiRequestWithoutToken
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
    graphQlApiRequestWithoutToken
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
    graphQlApiRequestWithoutToken
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


markProductInHistory : Product.Id -> Token -> (Result String Product.ProductDetail -> msg) -> Cmd msg
markProductInHistory productId =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "markProductInHistory"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "productId", GraphQLString (Product.idToString productId) )
                        ]
                    , return = productDetailReturn
                    }
                ]
        )
        (Jd.field "markProductInHistory" productDetailDecoder)



{- ==============================================================================
                              商品にいいねをする
   ==============================================================================
-}


likeProduct : Product.Id -> Token -> (Result String Int -> msg) -> Cmd msg
likeProduct productId =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "likeProduct"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "productId", GraphQLString (Product.idToString productId) )
                        ]
                    , return = productOnlyLikeCountReturn
                    }
                ]
        )
        (Jd.field "likeProduct" productOnlyLikeCountDecoder)


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


unlikeProduct : Product.Id -> Token -> (Result String Int -> msg) -> Cmd msg
unlikeProduct productId callBack =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "unlikeProduct"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
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
    graphQlApiRequestWithoutToken
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


addProductComment :
    Product.Id
    -> String
    -> Token
    -> (Result String (List Product.Comment) -> msg)
    -> Cmd msg
addProductComment productId commentBody =
    graphQlApiRequestWithToken
        (\t ->
            Mutation
                [ Field
                    { name = "addProductComment"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString t) )
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
        (Jd.field "addProductComment"
            (Jd.field "comments"
                (Jd.list productCommentDecoder)
            )
        )


dateTimeDecoder : Jd.Decoder Time.Posix
dateTimeDecoder =
    Jd.float
        |> Jd.map (floor >> Time.millisToPosix)



{- ==============================================================================
                              商品の取引を開始する
   ==============================================================================
-}


startTrade : Product.Id -> Token -> (Result String Trade.Trade -> msg) -> Cmd msg
startTrade productId =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "startTrade"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "productId", GraphQLString (Product.idToString productId) )
                        ]
                    , return = tradeReturn
                    }
                ]
        )
        (Jd.field "startTrade" tradeDecoder)


tradeDetailReturn : List Field
tradeDetailReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field
        { name = "product"
        , args = []
        , return =
            productDetailReturn
        }
    , Field { name = "buyer", args = [], return = userWithNameReturn }
    , Field { name = "createdAt", args = [], return = [] }
    , Field { name = "updateAt", args = [], return = [] }
    , Field { name = "status", args = [], return = [] }
    , Field
        { name = "comment"
        , args = []
        , return = tradeCommentReturn
        }
    ]


tradeDetailDecoder : Jd.Decoder Trade.TradeDetail
tradeDetailDecoder =
    Jd.succeed
        (\id product buyer createdAt updateAt comments status ->
            Trade.detailFromApi
                { id = id
                , product = product
                , buyer = buyer
                , createdAt = createdAt
                , updateAt = updateAt
                , comments = comments
                , status = status
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.required "product" productDetailDecoder
        |> Jdp.required "buyer" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder
        |> Jdp.required "updateAt" dateTimeDecoder
        |> Jdp.required "comment" (Jd.list tradeCommentDecoder)
        |> Jdp.required "status" tradeStatusDecoder


tradeReturn : List Field
tradeReturn =
    [ Field { name = "id", args = [], return = [] }
    , Field
        { name = "product"
        , args = []
        , return =
            productReturn ++ [ Field { name = "seller", args = [], return = userWithNameReturn } ]
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


tradeCommentReturn : List Field
tradeCommentReturn =
    [ Field { name = "body", args = [], return = [] }
    , Field { name = "speaker", args = [], return = [] }
    , Field { name = "createdAt", args = [], return = [] }
    ]


tradeCommentDecoder : Jd.Decoder Trade.Comment
tradeCommentDecoder =
    Jd.succeed
        (\body speaker createdAt ->
            Trade.Comment
                { body = body
                , speaker = speaker
                , createdAt = createdAt
                }
        )
        |> Jdp.required "body" Jd.string
        |> Jdp.required "speaker" tradeSpeakerDecoder
        |> Jdp.required "createdAt" dateTimeDecoder


tradeSpeakerDecoder : Jd.Decoder Trade.SellerOrBuyer
tradeSpeakerDecoder =
    Jd.string
        |> Jd.andThen
            (\id ->
                case id of
                    "seller" ->
                        Jd.succeed Trade.Seller

                    "buyer" ->
                        Jd.succeed Trade.Buyer

                    _ ->
                        Jd.fail "sellerかbuyer以外のspeakerを受け取ってしまった"
            )


tradeStatusDecoder : Jd.Decoder Trade.Status
tradeStatusDecoder =
    Jd.string
        |> Jd.andThen
            (\id ->
                case Trade.statusFromIdString id of
                    Just status ->
                        Jd.succeed status

                    Nothing ->
                        Jd.fail ("取引の状態(" ++ id ++ ")を理解できなかった")
            )



{- ==============================================================================
                            取引の詳細を取得する
   ==============================================================================
-}


getTradeDetail : Trade.Id -> Token -> (Result String Trade.TradeDetail -> msg) -> Cmd msg
getTradeDetail id =
    graphQlApiRequestWithToken
        (\token ->
            Query
                [ Field
                    { name = "trade"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "tradeId", GraphQLString (Trade.idToString id) )
                        ]
                    , return = tradeDetailReturn
                    }
                ]
        )
        (Jd.field "trade" tradeDetailDecoder)



{- ==============================================================================
                              取引のコメントを追加する
   ==============================================================================
-}


addTradeComment : Trade.Id -> String -> Token -> (Result String Trade.TradeDetail -> msg) -> Cmd msg
addTradeComment tradeId body =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "addTradeComment"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                        , ( "body", GraphQLString body )
                        ]
                    , return = tradeDetailReturn
                    }
                ]
        )
        (Jd.field "addTradeComment" tradeDetailDecoder)



{- ==============================================================================
                              取引をキャンセルする
   ==============================================================================
-}


cancelTrade : Trade.Id -> Token -> (Result String Trade.TradeDetail -> msg) -> Cmd msg
cancelTrade tradeId =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "cancelTrade"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                        ]
                    , return =
                        tradeDetailReturn
                    }
                ]
        )
        (Jd.field "cancelTrade" tradeDetailDecoder)



{- ==============================================================================
                              取引を終了する
   ==============================================================================
-}


finishTrade : Trade.Id -> Token -> (Result String Trade.TradeDetail -> msg) -> Cmd msg
finishTrade tradeId =
    graphQlApiRequestWithToken
        (\token ->
            Mutation
                [ Field
                    { name = "finishTrade"
                    , args =
                        [ ( "accessToken", GraphQLString (tokenGetAccessTokenAsString token) )
                        , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                        ]
                    , return =
                        tradeDetailReturn
                    }
                ]
        )
        (Jd.field "finishTrade" tradeDetailDecoder)



{- ==============================================================================
                         ソーシャルログインでログイン/新規登録
   ==============================================================================
-}


logInOrSignUpUrlRequest : Data.SocialLoginService.SocialLoginService -> (Result String Url.Url -> msg) -> Cmd msg
logInOrSignUpUrlRequest service callBack =
    graphQlApiRequestWithoutToken
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


graphQlApiRequestWithoutToken : Query -> Jd.Decoder a -> (Result String a -> msg) -> Cmd msg
graphQlApiRequestWithoutToken query responseDecoder callBack =
    graphQlApiRequestTaskWithoutToken query responseDecoder
        |> Task.attempt callBack


graphQlApiRequestWithToken : (Token -> Query) -> Jd.Decoder a -> Token -> (Result String a -> msg) -> Cmd msg
graphQlApiRequestWithToken query responseDecoder token callBack =
    graphQlApiRequestTaskWithToken token query responseDecoder
        |> Task.andThen (graphQlResultToTask token query responseDecoder)
        |> Task.attempt callBack


graphQlResultToTask : Token -> (Token -> Query) -> Jd.Decoder a -> GraphQLResultOk a -> Task.Task String a
graphQlResultToTask token query responseDecoder result =
    case result of
        JwtExpired ->
            graphQlTokenRefreshTask (tokenGetRefreshTokenAsString token)
                |> Task.andThen
                    (\newToken -> graphQlApiRequestTaskWithoutToken (query newToken) responseDecoder)

        GetData a ->
            Task.succeed a



{- ===== ====== -}


graphQlTokenRefreshTask : String -> Task.Task String Token
graphQlTokenRefreshTask refresh =
    graphQlApiRequestTaskWithoutToken
        (Mutation
            [ Field
                { name = "getAccessTokenAndUpdateRefreshToken"
                , args = [ ( "refreshToken", GraphQLString refresh ) ]
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
                    Token
                        { access = accessToken
                        , refresh = refreshToken
                        }
                )
                |> Jdp.required "refreshToken" Jd.string
                |> Jdp.required "accessToken" Jd.string
            )
        )


graphQlApiRequestTaskWithToken : Token -> (Token -> Query) -> Jd.Decoder a -> Task.Task String (GraphQLResultOk a)
graphQlApiRequestTaskWithToken token query responseDecoder =
    Http.task
        { method = "POST"
        , headers = []
        , url = "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api"
        , body = graphQlRequestBody (queryToString (query token))
        , resolver = Http.stringResolver (graphQlResponseDecoderWithToken responseDecoder)
        , timeout = Nothing
        }


graphQlApiRequestTaskWithoutToken : Query -> Jd.Decoder a -> Task.Task String a
graphQlApiRequestTaskWithoutToken query responseDecoder =
    Http.task
        { method = "POST"
        , headers = []
        , url = "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api"
        , body = graphQlRequestBody (queryToString query)
        , resolver = Http.stringResolver (graphQlResponseDecoderWithoutToken responseDecoder)
        , timeout = Nothing
        }


type GraphQLResultOk a
    = GetData a
    | JwtExpired



{- ===== ====== -}


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


graphQlResponseDecoderWithoutToken : Jd.Decoder a -> Http.Response String -> Result String a
graphQlResponseDecoderWithoutToken decoder response =
    case response of
        Http.BadUrl_ _ ->
            Err "BadURL"

        Http.Timeout_ ->
            Err "Timeout"

        Http.NetworkError_ ->
            Err "NetworkError"

        Http.BadStatus_ _ body ->
            case body |> Jd.decodeString graphQLErrorResponseDecoderWithoutToken of
                Ok message ->
                    Err message

                Err decodeError ->
                    Err (Jd.errorToString decodeError)

        Http.GoodStatus_ _ body ->
            body
                |> Jd.decodeString
                    (Jd.field "data"
                        decoder
                    )
                |> Result.mapError Jd.errorToString


graphQLErrorResponseDecoderWithoutToken : Jd.Decoder String
graphQLErrorResponseDecoderWithoutToken =
    Jd.field "errors"
        (Jd.list
            (Jd.succeed
                (\message lineAndColumnList ->
                    "message "
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
        |> Jd.map (String.join ",\n")


graphQlResponseDecoderWithToken : Jd.Decoder a -> Http.Response String -> Result String (GraphQLResultOk a)
graphQlResponseDecoderWithToken decoder response =
    case response of
        Http.BadUrl_ _ ->
            Err "BadURL"

        Http.Timeout_ ->
            Err "Timeout"

        Http.NetworkError_ ->
            Err "NetworkError"

        Http.BadStatus_ _ body ->
            case body |> Jd.decodeString graphQLErrorResponseDecoderWithToken of
                Ok (Ok ()) ->
                    Ok JwtExpired

                Ok (Err message) ->
                    Err message

                Err decodeError ->
                    Err (Jd.errorToString decodeError)

        Http.GoodStatus_ _ body ->
            case body |> Jd.decodeString (Jd.field "data" decoder) of
                Ok a ->
                    Ok (GetData a)

                Err decodeError ->
                    Err (Jd.errorToString decodeError)


graphQLErrorResponseDecoderWithToken : Jd.Decoder (Result String ())
graphQLErrorResponseDecoderWithToken =
    Jd.field "errors"
        (Jd.list
            (Jd.succeed
                (\message lineAndColumnList ->
                    if message == "jwt expired" then
                        Ok ()

                    else
                        Err
                            ("message "
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
        |> Jd.map batchError


batchError : List (Result String ()) -> Result String ()
batchError list =
    case list of
        [] ->
            Err "空のエラー"

        (Ok ()) :: _ ->
            Ok ()

        (Err message) :: xs ->
            case batchError xs of
                Ok () ->
                    Ok ()

                Err messageJoined ->
                    Err (message ++ ",\n" ++ messageJoined)
