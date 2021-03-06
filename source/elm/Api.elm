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
    , getBoughtProductIds
    , getCommentedProductIds
    , getHistoryViewProducts
    , getLikedProducts
    , getLineNotifyUrl
    , getLogInUrl
    , getMyNameAndLikedProductsId
    , getProductComments
    , getSoldProductIds
    , getTradeAndComments
    , getTradedProductList
    , getTradingProductList
    , getUserProfile
    , likeProduct
    , markProductInHistory
    , registerSignUpData
    , searchProducts
    , sellProduct
    , startTrade
    , tokenFromString
    , tokenToString
    , unlikeProduct
    , updateProduct
    , updateProfile
    , userWithNameDecoder
    )

import Data.Category as Category
import Data.EmailAddress as EmailAddress
import Data.ImageId as ImageId
import Data.Product as Product
import Data.SearchCondition as SearchCondition
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
    { emailAddress : EmailAddress.EmailAddress
    , image : Maybe String
    , university : University.University
    , displayName : String
    }


registerSignUpData : String -> SignUpRequest -> (Result String String -> msg) -> Cmd msg
registerSignUpData sendEmailToken { displayName, image, university, emailAddress } callBack =
    graphQlApiRequest
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
        (Jd.field "registerSignUpData" Jd.string)
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
    = Token String


tokenFromString : String -> Token
tokenFromString =
    Token


tokenToString : Token -> String
tokenToString (Token accessToken) =
    accessToken



{- =================================================
          自分のプロフィールといいねした商品の取得
   =================================================
-}


getMyNameAndLikedProductsId : Token -> (Result String ( User.WithName, List Product.Id ) -> msg) -> Cmd msg
getMyNameAndLikedProductsId token =
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


sellProduct : SellProductRequest -> Token -> (Result String Product.Product -> msg) -> Cmd msg
sellProduct (SellProductRequest request) token =
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
                , return = productReturn
                }
            ]
        )
        (Jd.field "sellProduct" productDecoder)


productReturn : List Field
productReturn =
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
    , Field { name = "thumbnailImageId", args = [], return = [] }
    , Field { name = "updateAt", args = [], return = [] }
    ]


productDecoder : Jd.Decoder Product.Product
productDecoder =
    Jd.succeed
        (\id name description price condition category status imageIds likedCount seller createdAt thumbnailImageId updateAt ->
            Product.fromApi
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
                , thumbnailImageId = thumbnailImageId
                , updateAt = updateAt
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
        |> Jdp.required "thumbnailImageId" imageIdDecoder
        |> Jdp.required "updateAt" dateTimeDecoder


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
        , category : Category.Category
        , addImageList : List String
        , deleteImageIndex : Set.Set Int
        }


updateProduct : Product.Id -> UpdateProductRequest -> Token -> (Result String Product.Product -> msg) -> Cmd msg
updateProduct productId (UpdateProductRequest rec) token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "updateProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    , ( "name", GraphQLString rec.name )
                    , ( "description", GraphQLString rec.description )
                    , ( "price", GraphQLInt rec.price )
                    , ( "condition", GraphQLEnum (Product.conditionToIdString rec.condition) )
                    , ( "category", GraphQLEnum (Category.toIdString rec.category) )
                    , ( "addImageList"
                      , rec.addImageList
                            |> List.map GraphQLString
                            |> GraphQLList
                      )
                    , ( "deleteImageIndex"
                      , rec.deleteImageIndex
                            |> Set.toList
                            |> List.map GraphQLInt
                            |> GraphQLList
                      )
                    ]
                , return = productReturn
                }
            ]
        )
        (Jd.field "updateProduct"
            productDecoder
        )



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
updateProfile { displayName, introduction, image, university } token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "updateProfile"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
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
getLikedProducts token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
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
getHistoryViewProducts token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
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


getSoldProductIds : User.Id -> (Result String (List Product.Id) -> msg) -> Cmd msg
getSoldProductIds userId =
    graphQlApiRequest
        (Query
            [ Field
                { name = "user"
                , args = [ ( "userId", GraphQLString (User.idToString userId) ) ]
                , return =
                    [ Field
                        { name = "soldProductAll"
                        , args = []
                        , return = [ Field { name = "id", args = [], return = [] } ]
                        }
                    ]
                }
            ]
        )
        (Jd.field "user"
            (Jd.field "soldProductAll" (Jd.list (Jd.field "id" (Jd.string |> Jd.map Product.idFromString))))
        )



{- ============================================================
               自分が購入した商品を取得する
   ============================================================
-}


getBoughtProductIds : Token -> (Result String (List Product.Id) -> msg) -> Cmd msg
getBoughtProductIds token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
                , return =
                    [ Field
                        { name = "boughtProductAll"
                        , args = []
                        , return = [ Field { name = "id", args = [], return = [] } ]
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "boughtProductAll" (Jd.list (Jd.field "id" (Jd.string |> Jd.map Product.idFromString))))
        )



{- ============================================================
                      取引中の取引の取得する
   ============================================================
-}


getTradingProductList : Token -> (Result String (List Trade.Trade) -> msg) -> Cmd msg
getTradingProductList token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
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
getTradedProductList token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
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


getCommentedProductIds : Token -> (Result String (List Product.Id) -> msg) -> Cmd msg
getCommentedProductIds token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
                , return =
                    [ Field
                        { name = "commentedProductAll"
                        , args = []
                        , return = [ Field { name = "id", args = [], return = [] } ]
                        }
                    ]
                }
            ]
        )
        (Jd.field "userPrivate"
            (Jd.field "commentedProductAll" (Jd.list (Jd.field "id" (Jd.string |> Jd.map Product.idFromString))))
        )



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



{- ==============================================================================
                              商品を削除する
   ==============================================================================
-}


deleteProduct : Product.Id -> Token -> (Result String () -> msg) -> Cmd msg
deleteProduct productId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "deleteProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = []
                }
            ]
        )
        (Jd.field "deleteProduct"
            (Jd.bool
                |> Jd.andThen
                    (\b ->
                        if b then
                            Jd.succeed ()

                        else
                            Jd.fail "商品の削除に失敗"
                    )
            )
        )



{- ==============================================================================
                              商品を閲覧履歴に追加する
   ==============================================================================
-}


markProductInHistory : Product.Id -> Token -> (Result String Product.Product -> msg) -> Cmd msg
markProductInHistory productId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "markProductInHistory"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = productReturn
                }
            ]
        )
        (Jd.field "markProductInHistory" productDecoder)



{- ==============================================================================
                              商品にいいねをする
   ==============================================================================
-}


likeProduct : Product.Id -> Token -> (Result String () -> msg) -> Cmd msg
likeProduct productId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "likeProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = []
                }
            ]
        )
        (Jd.succeed ())



{- ==============================================================================
                              商品のいいねをはずす
   ==============================================================================
-}


unlikeProduct : Product.Id -> Token -> (Result String () -> msg) -> Cmd msg
unlikeProduct productId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "unlikeProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "productId", GraphQLString (Product.idToString productId) )
                    ]
                , return = []
                }
            ]
        )
        (Jd.succeed ())



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


addProductComment :
    Product.Id
    -> String
    -> Token
    -> (Result String (List Product.Comment) -> msg)
    -> Cmd msg
addProductComment productId commentBody token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "addProductComment"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
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
startTrade productId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "startTrade"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
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
            [ Field { name = "id", args = [], return = [] } ]
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


tradeAndCommentDecoder : Jd.Decoder ( Trade.Trade, List Trade.Comment )
tradeAndCommentDecoder =
    Jd.succeed
        (\id productId buyer createdAt updateAt status comments ->
            ( Trade.fromApi
                { id = id
                , productId = productId
                , buyer = buyer
                , createdAt = createdAt
                , updateAt = updateAt
                , status = status
                }
            , comments
            )
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.requiredAt [ "product", "id" ] Jd.string
        |> Jdp.required "buyer" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder
        |> Jdp.required "updateAt" dateTimeDecoder
        |> Jdp.required "status" tradeStatusDecoder
        |> Jdp.required "comment" (Jd.list tradeCommentDecoder)


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
    , Field { name = "status", args = [], return = [] }
    ]


tradeDecoder : Jd.Decoder Trade.Trade
tradeDecoder =
    Jd.succeed
        (\id productId buyer createdAt updateAt status ->
            Trade.fromApi
                { id = id
                , productId = productId
                , buyer = buyer
                , createdAt = createdAt
                , updateAt = updateAt
                , status = status
                }
        )
        |> Jdp.required "id" Jd.string
        |> Jdp.requiredAt [ "product", "id" ] Jd.string
        |> Jdp.required "buyer" userWithNameDecoder
        |> Jdp.required "createdAt" dateTimeDecoder
        |> Jdp.required "updateAt" dateTimeDecoder
        |> Jdp.required "status" tradeStatusDecoder


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


getTradeAndComments :
    Trade.Id
    -> Token
    ->
        (Result String ( Trade.Trade, List Trade.Comment )
         -> msg
        )
    -> Cmd msg
getTradeAndComments id token =
    graphQlApiRequest
        (Query
            [ Field
                { name = "trade"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "tradeId", GraphQLString (Trade.idToString id) )
                    ]
                , return = tradeDetailReturn
                }
            ]
        )
        (Jd.field "trade" tradeAndCommentDecoder)



{- ==============================================================================
                              取引のコメントを追加する
   ==============================================================================
-}


addTradeComment :
    Trade.Id
    -> String
    -> Token
    ->
        (Result String ( Trade.Trade, List Trade.Comment )
         -> msg
        )
    -> Cmd msg
addTradeComment tradeId body token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "addTradeComment"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                    , ( "body", GraphQLString body )
                    ]
                , return = tradeDetailReturn
                }
            ]
        )
        (Jd.field "addTradeComment" tradeAndCommentDecoder)



{- ==============================================================================
                              取引をキャンセルする
   ==============================================================================
-}


cancelTrade : Trade.Id -> Token -> (Result String ( Trade.Trade, List Trade.Comment ) -> msg) -> Cmd msg
cancelTrade tradeId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "cancelTrade"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                    ]
                , return =
                    tradeDetailReturn
                }
            ]
        )
        (Jd.field "cancelTrade" tradeAndCommentDecoder)



{- ==============================================================================
                              取引を終了する
   ==============================================================================
-}


finishTrade :
    Trade.Id
    -> Token
    ->
        (Result String ( Trade.Trade, List Trade.Comment )
         -> msg
        )
    -> Cmd msg
finishTrade tradeId token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "finishTrade"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "tradeId", GraphQLString (Trade.idToString tradeId) )
                    ]
                , return =
                    tradeDetailReturn
                }
            ]
        )
        (Jd.field "finishTrade" tradeAndCommentDecoder)



{- ==============================================================================
                            商品の検索
   ==============================================================================
-}


searchProducts : SearchCondition.Condition -> (Result String (List Product.Product) -> msg) -> Cmd msg
searchProducts condition callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "productSearch"
                , args = searchConditionToArgs condition
                , return = productReturn
                }
            ]
        )
        (Jd.field "productSearch"
            (Jd.list productDecoder)
        )
        callBack


searchConditionToArgs : SearchCondition.Condition -> List ( String, GraphQLValue )
searchConditionToArgs condition =
    ( "query", GraphQLString (SearchCondition.getQuery condition) )
        :: (case SearchCondition.getCategory condition of
                SearchCondition.CategoryNone ->
                    []

                SearchCondition.CategoryGroup group ->
                    [ ( "categoryGroup", GraphQLEnum (Category.groupToIdString group) )
                    ]

                SearchCondition.CategoryCategory category ->
                    [ ( "category", GraphQLEnum (Category.toIdString category) )
                    ]
           )
        ++ (case SearchCondition.getUniversitySelect condition of
                SearchCondition.UniversityNone ->
                    []

                SearchCondition.UniversityGraduate graduate ->
                    [ ( "graduate", GraphQLEnum (University.graduateToIdString graduate) )
                    ]

                SearchCondition.UniversitySchool school ->
                    [ ( "school", GraphQLEnum (University.schoolToIdString school) )
                    ]

                SearchCondition.UniversityDepartment department ->
                    [ ( "department", GraphQLEnum (University.departmentToIdString department) ) ]
           )



{- ==============================================================================
                         ソーシャルログインでログイン/新規登録
   ==============================================================================
-}


getLogInUrl : Data.SocialLoginService.SocialLoginService -> (Result String Url.Url -> msg) -> Cmd msg
getLogInUrl service =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getLogInUrl"
                , args =
                    [ ( "service"
                      , GraphQLEnum
                            (case service of
                                Data.SocialLoginService.Line ->
                                    "line"
                            )
                      )
                    ]
                , return = []
                }
            ]
        )
        logInUrlResponseToResult


logInUrlResponseToResult : Jd.Decoder Url.Url
logInUrlResponseToResult =
    Jd.field "getLogInUrl" Jd.string
        |> Jd.andThen
            (\urlString ->
                case Url.fromString urlString of
                    Just url ->
                        Jd.succeed url

                    Nothing ->
                        Jd.fail "url format error"
            )



{- ==============================================================================
                            LINE Notify での通知設定
   ==============================================================================
-}


getLineNotifyUrl : Token -> (Result String Url.Url -> msg) -> Cmd msg
getLineNotifyUrl token =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getLineNotifyUrl"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
                , return = []
                }
            ]
        )
        (Jd.field "getLineNotifyUrl" Jd.string
            |> Jd.andThen
                (\urlString ->
                    case Url.fromString urlString of
                        Just url ->
                            Jd.succeed url

                        Nothing ->
                            Jd.fail "url format error"
                )
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


graphQlApiRequest : Query -> Jd.Decoder a -> (Result String a -> msg) -> Cmd.Cmd msg
graphQlApiRequest query responseDecoder callBack =
    Http.post
        { url = "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api"
        , body = graphQlRequestBody (queryToString query)
        , expect = Http.expectStringResponse callBack (graphQlResponseDecoder responseDecoder)
        }



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
            case body |> Jd.decodeString graphQLErrorResponseDecoder of
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


graphQLErrorResponseDecoder : Jd.Decoder String
graphQLErrorResponseDecoder =
    Jd.field "errors"
        (Jd.list
            (Jd.field "message" Jd.string)
        )
        |> Jd.map (String.join ", ")
