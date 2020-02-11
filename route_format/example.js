// GET - req.query
// 1 - "+"
query_string: GET ../search?q=tobi+ferret
method: req.query.q
result: "tobi ferret"

// 2 - "&" 
query_string: GET ../shoes?order=desc&shoe[color]=blue&shoe[type]=converse
method: req.query.order
result: "desc"

method: req.query.shoe.color
result: "blue"

method: req.query.shoe.type
result: "converse"

// POST - req.body
query_string: POST user[name]=tobi&user[email]=tobi@learnboost.com
method: req.body.user.name
result: "tobi"

method: req.body.user.email
result: "tobi@learnboost.com"

query_string: POST {"name": "tobi"}
method: req.body.name
result: "tobi"


// GET & POST - req.params
query_string: GET ../user/tj
method: req.params.name
result: "tj"

query_string: GET ../file/javascripts/jquery.js 
method: req.params[0]
results: "javascripts/jquery.js"

// GET & POST - req.param(name)
query_string: GET ?name=tobi
method: req.param('name')
result: "tobi"

query_string: POST name=tobi
method: req.param('name')
result: "tobi"

query_string: /user/tobi for /user/:name
method: req.param('name')
result: "tobi"

-----------------------------------------------
req.query: 处理 get 请求, 获取 get 请求参数
req.body: 处理 post 请求, 获取 post 请求体
req.params: 处理 /:xxx 形式的 get 或 post 请求, 获取请求参数
req.param(): 处理 get 和 post 请求，但查找优先级由高到低为 req.params→req.body→req.query