window.onload=function(){
      

  		var oBtn1=document.getElementById('my_button1');
  		var oBtn2=document.getElementById('my_button2');
      var oColor=document.getElementById('my_color');
  		var oInput=document.getElementById('my_input');
  		var oWall=document.getElementById('barrage_wall');
      var oTexts=document.getElementById('barrage_text');
      var oControl=document.getElementById('control');
     

      var oTbody=oTexts.getElementsByTagName('tbody')[0];


      //设置当前时间
      var date=new Date();
      //小时，分钟一位数时0不能取消
      var hours=date.getHours().toString();
      var minutes=date.getMinutes().toString();
      if(hours.length<2){hours='0'+hours;}
      if(minutes.length<2){minutes='0'+minutes}
      //将时间组合起来
      var timeNow=date.getMonth()+1+"-"+date.getDate()+" "+hours+":"+minutes;

      //引入野狗实时数据存储
      var config = {
        syncURL: "https://barrage-xx.wilddogio.com" //输入节点 URL
      };
      //初始化野狗
      wilddog.initializeApp(config);  
      var ref = wilddog.sync().ref();
      //push进野狗的数据的随机key值对象（这个对象的键值对，键是0开始的字符串，值是随机产生的push的key值），用on（value）取出，有变化就取一次
      var arrKey=[];
      ref.child('pushKeyObj').on('value',function(snapshot){               
          arrKey=snapshot.val();       
      })

      //模仿视频的计时器，一共60s
      var timeCount=0;
      var timerCt;//计时器名称
      //播放按钮按下的时候开始计数
      oControl.onclick=function(){
          clearInterval(timerCt);//防止计时器被重复调用，先清一次
          //计时器本体
          timerCt=setInterval(function(){
              document.title=timeCount;//让计时器在title上显示
                  //用once读取一次野狗服务器barrages节点上的数据
                  ref.child('barrages').once('value',function(snapshot){
                        //如果还没有数据的话，返回，否则的话，利用pushKey里面的key值读取弹幕内容
                        if(snapshot.val()==null){
                          return false
                        }else{     
                            //循环key值对象，类数组结构，取出颜色，内容，时间节点，时间，然后推到html中，并赋予动画效果 
                            for(var i=0;i<arrKey.length;i++){
                                var content=snapshot.val()[arrKey[i]];
                                if((content.timePoint+1)==timeCount){
                                  move(newElem(content.value,content.color,false));//false是指这些数据不是新产生的，
                                }
                            }
                        }
                  })


                  timeCount++;//时间计数变量自加
                  if(timeCount==60){//到60清除计数器
                    clearInterval(timerCt);
                  }

          },1000);   
      }



      //读取barrages上面的数据，推到html弹幕列表中
      ref.child('barrages').once('value',function(snapshot){
          if(snapshot.val()==null){
            console.log('falsefalse')
            return false
          }
          else{
              for(var i=0;i<arrKey.length;i++){
                 var content=snapshot.val()[arrKey[i]];
                 //控制时间节点的显示效果
                 if(content.timePoint.toString().length<2){
                    content.timePoint='00:0'+content.timePoint;
                 }else if(content.timePoint.toString().length=2){
                    content.timePoint='00:'+content.timePoint;
                 }

                 //控制显示长度，过长的截取并增加省略号
                 var k=0;
                 for(var j=0;j<content.value.length;j++){
                    if(content.value.charCodeAt(j)>19967&&content.value.charCodeAt(j)<40870){ k=k+2;}else{k++;}

                    if(k>10){
                      content.value=content.value.toString().substring(0,j)+"..."
                      break;
                    }
                 }
                 oTbody.innerHTML+='<tr><td>'+content.timePoint+'</td><td>'+content.value+'</td><td>'+content.timeNow+'</td></tr>';
            }                  
          }
      })


      //点击发射之后调用新建元素函数，把数据推到也野狗数据库
  		oBtn1.onclick=function(){ 
        if(oInput.value&&!oInput.value.match(/^\s+$/)){
          newElem(oInput.value,oColor.value,true);
        }    
        
      }


      //点击清屏，隐藏所有弹幕
      oBtn2.onclick=function(){
     
        var oPs=oWall.getElementsByTagName('p');
        for(var i=0;i<oPs.length;i++){
            oPs[i].style.display='none';
        }
      }


      //新建元素函数，并通过判断是否为新数据，之后将新数据推到野狗后台

      function newElem(text,color,isNewText){

        var newText=document.createTextNode(text);
        var newElem=document.createElement('p');
        newElem.className='barrages';
        var random_top=Math.floor(Math.random()*250);
        newElem.style.top=random_top+'px';
        newElem.style.left='100%';
        newElem.style.color=color;

         if(isNewText==true){
            var newPush=ref.child("barrages").push({
                "value":oInput.value,
                "color":oColor.value,
                "timePoint":timeCount,
                "timeNow":timeNow,
            });

            var newPushKey=newPush.key();

            ref.child('pushKeyObj').once('value',function(snapshot){
                if(snapshot.val()==null){
                  var pkl='0';
                }else{
                  var pkl=snapshot.val().length.toString();
                }
                wilddog.sync().ref('pushKeyObj').child(pkl).set(newPushKey);
            })

         }


        newElem.appendChild(newText);
        oWall.appendChild(newElem);

        oInput.value='';
        return newElem;
      }


      //通过控制相对定位的left来控制弹幕移动，随机的top值和速度
      function move(obj){
          var dis=parseInt(getComputedStyle(obj).left);
          var random_speed=Math.floor(Math.random()*30+10);
          var fontSize=getComputedStyle(obj).fontSize;
          var content_width=parseInt(fontSize)*obj.innerHTML.length;
          
          var timer=setInterval(function(){  
               if((dis+content_width)>0){
                 dis--;
                 obj.style.left=dis+'px';
               }else{
                clearInterval(timer);

                oWall.removeChild(obj);

               }
           },random_speed)    
      }

}