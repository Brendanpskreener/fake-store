# Record Types 
|Record Name|`type`|`pk`|`sk`|fields|
|---|---|---|---|---|
|Product|`product`|`product#{uuid}`|`product#{uuid}`||
|User|`user`|`user#{uuid}`|`user#{uuid}`||
|UserFavorite|`user-favorite`|`user#{uuid}`|`product#{uuid}`||

# Global Secondary Indices
|Table|Index Name|`pk`|`sk`|
|---|---|---|---|
|`FakeFaves`|`parent-lookup`|`sk`|`type`|
|`FakeFaves`|`child-lookup`|`pk`|`type`|

# Access Patterns
|Access Pattern|Table|Index|Query|
|---|---|---|---|
|Get product|`FakeFaves`|`n/a`|`pk=product{uuid}`|
|Get user|`FakeFaves`|`n/a`|`pk=user{uuid}`|
|Get user favorites|`FakeFaves`|`child-lookup`|`pk=user#{uuid}, type='user-favorite'`|
|Get users who favorited a product|`FakeFaves`|`parent-lookup`|`sk=product#{uuid}`|