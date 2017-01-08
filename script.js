window.onload=function(){
  		var oBtn1=document.getElementById('my_button1');
  		var oBtn2=document.getElementById('my_button2');
      var oColor=document.getElementById('my_color');
  		var oInput=document.getElementById('my_input');
  		var oWall=document.getElementById('barrage_wall');

  		oBtn1.onclick=function(){


  			var newText=document.createTextNode(oInput.value);
        oInput.value='';
  			var newElem=document.createElement('p');

  			newElem.className='barrages';

  			var random_top=Math.floor(Math.random()*250);

  			newElem.style.top=random_top+'px';
        newElem.style.left='100%';
        newElem.style.color=oColor.value;

  			newElem.appendChild(newText);

  			oWall.appendChild(newElem);

        move(newElem);
 	    
      }

      oBtn2.onclick=function(){
        var oPs=oWall.getElementsByTagName('p');
     
        for(var i=0;i<oPs.length;i++){
            oPs[i].style.display='none';
        }


      }
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