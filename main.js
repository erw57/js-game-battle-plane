/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var enemyGenerateSp=400;
var timer1,timer2;

function begin(){
    document.getElementById('button').style.display='none';
    document.getElementById('intro').style.display='none';
    document.getElementById('scorePan').style.display='block';
    document.getElementById('score').value=0;
    
    var flyer=new Player();
    timer1=setInterval(function(){
        var bullet=new Bullet(flyer.currLeft,flyer.currTop);
    },300);
    timer2=setInterval(function(){
        var ramdomSpeed=Math.floor(Math.random() * ( 100 + 1) + 50);
        var enemy=new Enemy(ramdomSpeed);
    },enemyGenerateSp);
        
    document.onkeydown=function(e){flyer.keyDown(e);};
}


//Player obj
var Player=function(){
    this.pan=document.getElementById('pan');
    this.currLeft=180;
    this.currTop=480;
    this.speed=20;
    
    this.ini();
};

Player.prototype={
    ini: function(){
        this.dom=document.createElement('div');
        this.dom.className='player';
        document.getElementById('pan').appendChild(this.dom);
        this.setPlane();
    },  
    //set position
    setPlane: function(){
        this.dom.style.left=this.currLeft+'px';
        this.dom.style.top=this.currTop+'px';
    },
    //key controll
    keyDown: function(e){
        e = e || window.event;
		
        if(e.keyCode==37)
	  this.moveLeft();
	if(e.keyCode==38)
	  this.moveUp();
	if(e.keyCode==39)
	  this.moveRight();
	if(e.keyCode==40)
	  this.moveDown();
    },
    
    //move
    moveLeft: function(){
        if(!this.outBorder(this.currLeft-this.speed,this.currTop)){
            this.currLeft-=this.speed;
            this.setPlane();
        }
    },
    
    moveUp: function(){
        if(!this.outBorder(this.currLeft,this.currTop-this.speed)){
            this.currTop-=this.speed;
            this.setPlane();
        }
    },
    
    moveRight: function(){
        if(!this.outBorder(this.currLeft+this.speed,this.currTop)){
            this.currLeft+=this.speed;
            this.setPlane();
        }
    },
    
    moveDown: function(){
        if(!this.outBorder(this.currLeft,this.currTop+this.speed)){
            this.currTop+=this.speed;
            this.setPlane();
        }
    },
    //check if plane goes out of border
    outBorder: function(left,top){
        if(left<0||left>360||top<0||top>480)
            return true;
    }
};

//Bullet obj
var Bullet=function(planeLeft,planeTop){
    this.left=planeLeft;
    this.top=planeTop;
    this.ini();
};

Bullet.prototype={
    ini: function(){
        this.dom=document.createElement('div');
        this.dom.className='bullet';
        document.getElementById('pan').appendChild(this.dom);
        this.startBullet();
    },
    //intial position
    startBullet: function(){
        this.dom.style.left=this.left+10+'px';
        this.dom.style.top=this.top-5+'px';
        this.moveBullet();
    },
    //move bullet to top
    moveBullet: function(){
        var _this=this;
        var timer=setInterval(function(){
            if(!_this.outBorder()&&!_this.hitEnemy()){
                _this.top-=10;
                _this.dom.style.top=_this.top+'px';
            }
            else{
                clearInterval(timer);
                document.getElementById('pan').removeChild(_this.dom);
                _this=null;
            }
        },30);    
    },
    //check if bullet goes out of border
    outBorder: function(){
        if(this.top-10<0)
            return true;
    },
    //check if bullet hit the enemy
    hitEnemy: function(){
        var _this=this;
        var explodeEnemy;
        var listEnemy=document.getElementsByClassName('enemy');
        for(var i=0;i<listEnemy.length;i++){
            var enemyLeft=parseInt(listEnemy[i].style.left);
            var enemyTop=parseInt(listEnemy[i].style.top);
            if(_this.left>(enemyLeft-15)&&_this.left<(enemyLeft+20)&&_this.top>enemyTop-8&&_this.top<enemyTop+20&&listEnemy[i].style.display==''){
                //remove enemy plan
                explodeEnemy=listEnemy[i];
                explodeEnemy.style.background='url("images/explode.png")';
                setTimeout(function(){explodeEnemy.style.display='none';},50);
                this.addScore();
                return true;
                break;
            }
        }       
    },
    
    addScore: function(){
        var score=parseInt(document.getElementById('score').innerHTML);
        document.getElementById('score').innerHTML=score+2;
        this.checkScore();
    },
    //changes game diffuculty according to score
    checkScore: function(){
        var score=parseInt(document.getElementById('score').innerHTML);
        if(score>20 && score<=60 && enemyGenerateSp==400)
           this.changeLevel(300);
        else if(score>60 && score<=150 && enemyGenerateSp==300)
           this.changeLevel(200)
        else if(score>150 && score<=280 && enemyGenerateSp==200)
           this.changeLevel(100);
        else if(score>280 && score<=400 && enemyGenerateSp==100)
           this.changeLevel(80);
        else if(score>400 && enemyGenerateSp==80)
           this.changeLevel(50);              
    },
    
    changeLevel: function(speed){
        enemyGenerateSp=speed;
        clearInterval(timer2); 
        timer2=setInterval(function(){
          var ramdomSpeed=Math.floor(Math.random() * ( 100 + 1) + 50);
          var enemy=new Enemy(ramdomSpeed);
        },speed);
    }
};

//Enemy
var Enemy=function(speed){
    this.left=0;
    this.top=0;
    this.speed=speed;
    this.ini();
};

Enemy.prototype={
    ini: function(){
        this.dom=document.createElement('div');
        this.dom.className='enemy';
        document.getElementById('pan').appendChild(this.dom);
        this.generateEnemy();
    },
    //randomly generate a position
    generateEnemy: function(){
        this.left=Math.floor(Math.random() * ( 365 + 1));  
        this.setEnemy();
        this.moveDown();
    },
    //set enemy's position
    setEnemy: function(){
        this.dom.style.left=this.left+'px';
        this.dom.style.top=this.top+'px';
    },
    
    moveDown: function(){
        var _this=this;
        
        var timer=setInterval(function(){
            if(!_this.outBorder()){
                _this.top+=10;
                _this.dom.style.top=_this.top+'px';
                _this.hitPlayer();
            }
            else{
                clearInterval(timer);
                document.getElementById('pan').removeChild(_this.dom);
                _this=null;
            }
        },this.speed);
        
    },
    
    outBorder: function(){
        if(this.top+10>485)
            return true;
    },
    //check if hit player. if does, alert and reload 
    hitPlayer: function(){
        var _this=this;
        var player=document.getElementsByClassName('player');
        var playerLeft=parseInt(player[0].style.left);
        var playerTop=parseInt(player[0].style.top);
        if(_this.left>playerLeft-23 && _this.left<playerLeft+25 && _this.top>playerTop-10 && _this.top<playerTop+20 && _this.dom.style.display==''){
            player[0].style.background='url("images/playerExplode.png")';//picture comes from Nipic,http://www.nipic.com/show/9518368.html.
            alert('Game Over! You Score: '+document.getElementById('score').innerHTML);
            location.reload();
        }
    }
};

