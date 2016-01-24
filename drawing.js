
/** 공통 함수 **/
function windowToCanvas(pCanvas, x, y) {
	var box = pCanvas.getBoundingClientRect();
	return {x: x-box.left * (pCanvas.width / box.width),
			y: y-box.top * (pCanvas.height / box.height)};
}

function stopEvent(e) {
    if (window.event) { //IE            
        window.event.cancelBubble = true; //전파 방지
        window.event.returnValue = false; //기본 동작 수행방지
    }
    //DOM 레벨 2
    if (e && e.stopPropagation && e.preventDefault) {
        e.stopPropagation(); //이벤트 전파 중지
        e.preventDefault(); //기본 동작 수행방지
    }
}

/** Pencil Class **/
var Pencel = function(parent, canvas, ctx) {
	this.parent = parent;
	this.canvas = canvas;
	this.ctx = ctx;
	
	this.lineWidth = 1;
	this.strokeType = "freeLine";
	
	this.preX = 0;
	this.preY = 0;
	this.loc = null;
	
	this.color = "#000000";
}

Pencel.prototype.init = function(e) {
	this.loc = windowToCanvas(this.canvas, e.clientX, e.clientY);
	this.preX = this.loc.x;
	this.preY = this.loc.y;	
}

Pencel.prototype.draw = function(e) {
	console.log('aaa');
	var oThis = this;
	
	oThis.loc = windowToCanvas(oThis.canvas, e.clientX, e.clientY);
	
	oThis.ctx.strokeStyle = this.color;		
	oThis.ctx.lineWidth = oThis.lineWidth;

	oThis.ctx.beginPath();
    //oThis.ctx.arc(oThis.loc.x, oThis.loc.y, radius, 0, Math.PI*2);
    //oThis.ctx.rect(oThis.loc.x, oThis.loc.y, 5, 5);
	oThis.ctx.moveTo(oThis.preX, oThis.preY);
	oThis.ctx.lineTo(oThis.loc.x, oThis.loc.y);
	oThis.ctx.closePath();
    
	oThis.ctx.fill();
	oThis.ctx.stroke();			

	oThis.preX = oThis.loc.x;
	oThis.preY = oThis.loc.y;
}

Pencel.prototype.setColor = function(color) {
	this.color = color;
}

Pencel.prototype.afterDraw = function(e) {
	
}
Pencel.prototype.foucusOut = function(e) {
	
}
Pencel.prototype.move = function(e) {
	
}
Pencel.prototype.saveDrawingSurface = function() {	
	this.parent.setSurfaceData(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));	
}
Pencel.prototype.incLineWidth = function() {
	this.lineWidth++;
}
Pencel.prototype.decLineWidth = function() {
	this.lineWidth--;
}

/** Eraser Class **/
var Eraser = function(parent, canvas, ctx) {
	this.parent = parent;
	this.canvas = canvas;
	this.ctx = ctx;
	
	this.lineWidth = 15;	
	
	this.preX = 0;
	this.preY = 0;
	this.loc = null;	
	
	this.eraseX = 0;
	this.eraseY = 0;	
}

Eraser.prototype.init = function(e) {
	this.loc = windowToCanvas(this.canvas, e.clientX, e.clientY);
	this.preX = this.loc.x;
	this.preY = this.loc.y;	
}

Eraser.prototype.draw = function(e) {
	this.loc = windowToCanvas(this.canvas, e.clientX, e.clientY);
	
	this.ctx.strokeStyle = "gray";
	this.ctx.lineWidth = "1";
	this.ctx.beginPath();
	this.ctx.clearRect((this.eraseX-this.lineWidth/2)-1, (this.eraseY-this.lineWidth/2)-1, Number(this.lineWidth)+2, Number(this.lineWidth)+2);								
	this.ctx.rect(this.loc.x-this.lineWidth/2, this.loc.y-this.lineWidth/2, this.lineWidth, this.lineWidth);				
	this.ctx.closePath();
	this.ctx.stroke();
	this.eraseX = this.loc.x;
	this.eraseY = this.loc.y;
}
Eraser.prototype.afterDraw = function(e) {
	this.loc = windowToCanvas(this.canvas, e.clientX, e.clientY);
	this.ctx.beginPath();
	this.ctx.clearRect((this.eraseX-this.lineWidth/2)-1, (this.eraseY-this.lineWidth/2)-1, Number(this.lineWidth)+2, Number(this.lineWidth)+2);
	this.ctx.clearRect((this.loc.x-this.lineWidth/2)-1, (this.loc.y-this.lineWidth/2)-1, Number(this.lineWidth)+2, Number(this.lineWidth)+2);
	this.ctx.closePath();
	this.saveDrawingSurface();
}
Eraser.prototype.foucusOut = function(e) {
	this.ctx.beginPath();
	this.ctx.clearRect((this.eraseX-this.lineWidth/2)-1, (this.eraseY-this.lineWidth/2)-1, Number(this.lineWidth)+2, Number(this.lineWidth)+2);				
	this.ctx.closePath();
	this.saveDrawingSurface();
}
Eraser.prototype.move = function(e) {
	this.restoreDrawingSurface();
	
	this.loc = windowToCanvas(this.canvas, e.clientX, e.clientY);
	
	this.ctx.strokeStyle = "gray";
	this.ctx.lineWidth = "1";
	this.ctx.beginPath();
	//this.ctx.clearRect((this.eraseX-this.eraseWidth/2)-1, (this.eraseY-this.eraseHeight/2)-1, Number(this.eraseWidth)+2, Number(this.eraseHeight)+2);								
	this.ctx.rect(this.loc.x-this.lineWidth/2, this.loc.y-this.lineWidth/2, this.lineWidth, this.lineWidth);				
	this.ctx.closePath();
	this.ctx.stroke();
	this.eraseX = this.loc.x;
	this.eraseY = this.loc.y;
}
Eraser.prototype.restoreDrawingSurface = function() {	
	var drawingSurfaceData = this.parent.getSurfaceData();
	var ratioW = drawingSurfaceData.width / this.canvas.width;
	var ratioH = drawingSurfaceData.height / this.canvas.height;
	
	var width = this.lineWidth*ratioW;
	var height = this.lineWidth*ratioH;
	
	this.ctx.putImageData(this.parent.getSurfaceData(), 0, 0
			, (this.eraseX-width/2)-1, (this.eraseY-height/2)-1
			, Number(width)+2, Number(height)+2);
}
Eraser.prototype.saveDrawingSurface = function() {	
	this.parent.setSurfaceData(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));	
}
Eraser.prototype.incLineWidth = function() {
	this.lineWidth++;
}
Eraser.prototype.decLineWidth = function() {
	this.lineWidth--;
}


/*** MAIN CLASS ***/
/** Drawing class **/
var Drawing = function(boxTag, width, height, imgSrc) {
	/** 이미지 경로 설정 **/
	var tempSrc = $("script[src*=drawing\\.js]").attr("src");
	console.log(tempSrc);
	
	var tempSrcArr = tempSrc.split("/");
	this.imgUrlPath = "";
	for(var i=0; i<tempSrcArr.length-1; i++) {
		this.imgUrlPath += tempSrcArr[i] + "/";
		
	}
	this.imgUrlPath += "img/";
	
	/** canvas 스타일 초기화 **/	
	this.canvasStyle = "border:2px solid gray;";
	
	this.toolBtnStyle = "float:left; cursor:pointer; padding:2px; border:1px solid black; width:20px; height:20px; background-size: 24px;";
	this.toolBtnStyle2 = "float:left; cursor:pointer; padding:2px; border:1px solid black; width: 20px; height:20px; text-align: center;";	
	
	this.isMouseDown = false;	
		
	/** canvas 데이터 임시 저장소 **/
	this.drawingSurfaceData = null;
	
	/** 초기화 파라미터 설정 **/	
	this.width = width;
	this.height = height;
	
	this.colorArr = [
         ["#FF0000", "#FFD8D8", "#FFA7A7", "#F15F5F", "#CC3D3D", "#980000", "#670000"]
         , ["#FF5E00", "#FAE0D4", "#FFC19E", "#F29661", "#CC723D", "#993800", "#662500"]	                
         , ["#FFBB00", "#FAECC5", "#FFE08C", "#F2CB61", "#CCA63D", "#997000", "#664B00"]
         , ["#FFE400", "#FAF4C0", "#FAED7D", "#E5D85C", "#C4B73B", "#998A00", "#665C00"]
         , ["#ABF200", "#E4F7BA", "#CEF279", "#BCE55C", "#9FC93C", "#6B9900", "#476600"]
         , ["#1DDB16", "#CEFBC9", "#B7F0B1", "#86E57F", "#47C83E", "#2F9D27", "#22741C"]
         , ["#00D8FF", "#D4F4FA", "#B2EBF4", "#5CD1E5", "#3DB7CC", "#008299", "#005766"]
         , ["#0054FF", "#D9E5FF", "#B2CCFF", "#6799FF", "#4374D9", "#003399", "#002266"]
         , ["#0100FF", "#DAD9FF", "#B5B2FF", "#6B66FF", "#4641D9", "#050099", "#030066"]
         , ["#5F00FF", "#E8D9FF", "#D1B2FF", "#A566FF", "#8041D9", "#3F0099", "#2A0066"]
         , ["#FF00DD", "#FFD9FA", "#FFB2F5", "#F361DC", "#D941C5", "#990085", "#660058"]
         , ["#FF007F", "#FFD9EC", "#FFB2D9", "#F361A6", "#D9418C", "#99004C", "#660033"]
         , ["#000000", "#F6F6F6", "#D5D5D5", "#A6A6A6", "#747474", "#4C4C4C", "#212121"]
         , ["#FFFFFF", "#EAEAEA", "#BDBDBD", "#8C8C8C", "#5D5D5D", "#353535", "#191919"]
 	];
	
	this.$box = $("#"+boxTag);
	this.name = this.$box.attr("name");
	this.canvasId = boxTag+"_canvas";
	
	this.$box.width(this.width);
	this.$box.append(this.makeCanvas()).append(this.makeHiddenInput(this.name));
	
	this.canvas = document.getElementById(this.canvasId);
	this.ctx = this.canvas.getContext("2d");
	
	this.pencilObj = new Pencel(this, this.canvas, this.ctx);
	this.eraserObj = new Eraser(this, this.canvas, this.ctx);
	this.currentTool = this.pencilObj;
	
	this.$box.prepend(this.makeToolBox());
	
	if(imgSrc != null && imgSrc.trim() != "") {
		this.$box.append("<img style='display:none;' onload='Drawing.whenLoadImage(this)' id='imgInCanvas' src='"+imgSrc+"' />");
		//var img=document.getElementById("imgInCanvas");
	}
}

Drawing.prototype.init = function() {
	this.bindEvents();
}

Drawing.prototype.getSurfaceData = function() {
	return this.drawingSurfaceData;
}
Drawing.prototype.setSurfaceData = function(drawingSurfaceData) {
	this.drawingSurfaceData = drawingSurfaceData;
}

Drawing.prototype.whenLoadImage = function(thiz) {	
	this.ctx.drawImage(thiz,0,0);
}

Drawing.prototype.bindEvents = function() {
	var oThis = this;
	
	oThis.canvas.onmousedown = function(e) {
		stopEvent(e);
		oThis.whenMouseDown(e);
	}
	oThis.canvas.onmouseup = function(e) {
		stopEvent(e);
		oThis.whenMouseUp(e);
	}		
	oThis.canvas.onmousemove = function(e) {
		stopEvent(e);
		oThis.whenMouseMove(e);
	}
	
	$(oThis.canvas).mouseleave(function(e) {
		oThis.isMouseDown = false;
		
		oThis.currentTool.foucusOut();		
	});
	
	$("#freeLineBtn_"+oThis.canvasId).click(function() {
		oThis.clickFreeLine(this);
	});
	
	$("#eraserBtn_"+oThis.canvasId).click(function() {
		oThis.clickEraser(this);
	});	
	
	$("#plusBtn_"+oThis.canvasId).click(function() {		
		oThis.clickPlusBtn();
	});
		
	$("#minusBtn_"+oThis.canvasId).click(function() {
		oThis.clickMinusBtn();
	});
	
	$("#eraseAllBtn_"+oThis.canvasId).click(function() {
		oThis.clickEraseAll();
	});
	
	$("#colorBtn_"+oThis.canvasId).click(function() {
		if($("#colorBox_"+oThis.canvasId).is(":visible")) {
			$("#colorBox_"+oThis.canvasId).hide();
		} else {
			$("#colorBox_"+oThis.canvasId).show();
		}
	});
	
	oThis.$box.find(".colorDiv").click(function(e) {
		var color = $(this).attr('id');		
		oThis.currentTool.setColor(color);
		$("#colorBtn_"+oThis.canvasId).css('background', color);
		$("#colorBox_"+oThis.canvasId).hide();
	});
}

Drawing.prototype.whenMouseDown = function(e) {
	this.currentTool.init(e);
			
	this.isMouseDown = true;		
}
Drawing.prototype.whenMouseUp = function(e) {
	var oThis = this;
	oThis.isMouseDown = false;
	
	this.currentTool.afterDraw(e);	
}
Drawing.prototype.whenMouseMove = function(e) {
	var oThis = this;	
	
	if(oThis.isMouseDown) {
		oThis.currentTool.draw(e);		
	} else {
		//oThis.currentTool.restoreDrawingSurface();
		oThis.currentTool.move(e);
	}
}

Drawing.prototype.saveDrawingSurface = function() {
	var oThis = this;
	oThis.drawingSurfaceData = oThis.ctx.getImageData(0, 0, oThis.canvas.width, oThis.canvas.height);
}

Drawing.prototype.restoreDrawingSurfaceAll = function() {
	var oThis = this;
	oThis.ctx.putImageData(oThis.drawingSurfaceData, 0, 0);
}

Drawing.prototype.makeCanvas = function() {
	var canvas = "";
	canvas += "<canvas id='"+this.canvasId+"' width='"+this.width+"' height='"+this.height+"' style='"+this.canvasStyle+"'>";
	canvas += "</canvas>";
	return canvas;
}

Drawing.prototype.makeHiddenInput = function(name) {		
	var input = "<input type='hidden' name='"+name+"' />";
	return input;
}

Drawing.prototype.makeToolBox = function() {
	
	var div = "";
	div += "<div style='width:100%;'>";		
		div += "<div style='float:left; margin-right:10px;'>";
			div += "<div class='toolBtn' id='freeLineBtn_"+this.canvasId+"' style='"+this.toolBtnStyle+" background-image:url(\""+this.imgUrlPath+"pencil.png\"); border-width:3px;'></div>";		
			div += "<div class='toolBtn' id='eraserBtn_"+this.canvasId+"' style='"+this.toolBtnStyle+" background-image:url(\""+this.imgUrlPath+"eraser.png\");'></div>";
		div += "</div>";
		
		div += "<div style='float:left; margin-right:10px;'>";				
			div += "<div class='toolBtn2' id='plusBtn_"+this.canvasId+"' style='"+this.toolBtnStyle2+"'>+</div>";
			div += "<div class='toolBtn2' id='minusBtn_"+this.canvasId+"' style='"+this.toolBtnStyle2+"'>-</div>";
			div += "<div id='txtWidth' class='toolBtn2' onclick='' style='"+this.toolBtnStyle2+"'>"+this.currentTool.lineWidth+"</div>";
		div += "</div>";
		
		div += "<div style='float:left; margin-right:10px; position:relative;'>";
			div += "<div class='toolBtn' id='colorBtn_"+this.canvasId+"' style='"+this.toolBtnStyle+" background:black;'></div>";
			div += "<div id='colorBox_"+this.canvasId+"' style='display:none; position:absolute; top:26px; width:300px;'>";			
			for(var i=0; i<this.colorArr.length; i++) {
				div += "<div style='float:left;background:white;'>";				
				for(var j=0; j<this.colorArr[i].length; j++) {
					div += "<div class='colorDiv' style='margin:0 1px 1px 0; width:16px; height:16px; background:"+this.colorArr[i][j]+";' id='"+this.colorArr[i][j]+"'></div>";
				}
				div += "</div>";
			}
			div += "</div>";
		div += "</div>";
		
		div += "<div style='float:left; margin-right:10px;'>";
			div += "<div class='toolBtn' id='eraseAllBtn_"+this.canvasId+"' style='"+this.toolBtnStyle+" background-image:url(\""+this.imgUrlPath+"eraseAll.png\");'></div>";
		div += "</div>";
	div += "</div>";
	
	return div;
}

Drawing.prototype.clickFreeLine = function(pThis) {
	var oThis = this;
		
	this.currentTool = this.pencilObj;
	oThis.resetToolBtn();
	oThis.whenSelectBtn($(pThis));
			
	oThis.resetTxtWidth(oThis.lineWidth);			
	
	oThis.currentTool.saveDrawingSurface();
}

Drawing.prototype.clickEraseAll = function(pThis) {
	var oThis = this;
	oThis.ctx.clearRect(0, 0, oThis.canvas.width, oThis.canvas.height);
	oThis.saveDrawingSurface();
}

Drawing.prototype.clickEraser = function(pThis) {
	var oThis = this;
	//oThis.strokeType = "eraser";
	this.currentTool = this.eraserObj;
	this.resetToolBtn();
	this.whenSelectBtn($(pThis));
	
	this.resetTxtWidth();		
	
	this.currentTool.saveDrawingSurface();
}

Drawing.prototype.clickPlusBtn = function() {
	oThis = this;
	this.currentTool.incLineWidth();
	this.resetTxtWidth();	
}

Drawing.prototype.clickMinusBtn = function() {
	oThis = this;
	this.currentTool.decLineWidth();
	this.resetTxtWidth();
}

Drawing.prototype.resetTxtWidth = function() {
	this.$box.find("#txtWidth").text(this.currentTool.lineWidth);
}

Drawing.prototype.resetToolBtn = function() {	
	this.$box.find(".toolBtn").css("border-width", "1px");
}

Drawing.prototype.whenSelectBtn = function($btn) {
	$btn.css("border-width", "3px");
}

Drawing.prototype.setImgByte = function() {	
	var imgData = this.canvas.toDataURL("image/png");
	imgData = imgData.replace("data:image/png;base64,", "");
	
	this.$box.find("input:hidden[name="+this.name+"]").val(imgData);
}

Drawing.prototype.save = function(formTag) {
	this.setImgByte();
	var $form = $("#"+formTag);
	
	$form.submit();
}