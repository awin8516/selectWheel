selectWheel for mobile
============

|Author|evan.fu|
|---|---
|E-mail|153668770@qq.com

---
## html
```html
<div id="address">请选择</div>
```

## script
```javascript
new selectWheel('#address', {
    speed : 600,
    success : function(data){
        console.log(data);
        document.getElementById('address').innerHTML = data.join(' ');
    }
})
``` 

### 自定义数据
```javascript
var myData = [
    {
        label : '一级',
        value : [
            {
                "id": 1,
                "pid":null,
                "name": "红酒"
            },
            {
                "id": 2,
                "pid":null,
                "name": "白酒"
            },
            {
                "id": 4,
                "pid":null,
                "name": "药酒"
            }
        ]
    },
    {
        label : '二级',
        value : [
            {
                "id": 11,
                "pid":1,
                "name": "红酒001"
            },
            {
                "id": 12,
                "pid":1,
                "name": "红酒002"
            },
            {
                "id": 21,
                "pid":2,
                "name": "白酒001"
            }
        ]
    },
    {
        label : '三级',
        value : [
            {
                "id": 121,
                "pid":12,
                "name": "红酒002-001"
            }
        ]
    }
];
    
new selectWheel('#address', {
    data : myData,
    speed : 600,
    success : function(data){
        console.log(data);
        $('#address').html(data.join(' '));
    }
})
``` 
### option
|key |value|
|:--:|-----|
|style| 样式 slide/gear 默认slide @String
|datePicker|年/月/日 默认false @Boolean
|data| 自定义数据 @Object
|speed| 展开速度 默认500 @Number
|init| 初始化回调 @function	
|success| 完成回调 @function 

## Example
1. [Demo](https://awin8516.github.io/selectWheel/docs/)  