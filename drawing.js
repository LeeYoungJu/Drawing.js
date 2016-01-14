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

var Drawing = {
	canvas: null,
	ctx: null,
	
	lineWidth: 1,
	strokeType: "freeLine",
	
	width: "",
	height: "",
	
	canvasStyle: "border:2px solid gray;",
	toolBtnStyle: "float:left; cursor:pointer; padding:2px; border:1px solid gray;",
	toolBtnStyle2: "float:left; cursor:pointer; padding:2px; border:1px solid gray; width: 15px; text-align: center;",
	
	isMouseDown: false,
	radius: 1,
	preX: 0,
	preY: 0,
	loc: null,
	
	eraseWidth: "15",
	eraseHeight: "15",
	eraseX: 0,
	eraseY: 0,
	
	drawingSurfaceData: null,
		
	init: function(boxTag, canvasTag, width, height, imgSrc) {
		this.width = width;
		this.height = height;
		
		$("#"+boxTag).append(this.makeToolBox()).append(this.makeCanvas());
		
		this.canvas = document.getElementById(canvasTag);
		this.ctx = this.canvas.getContext("2d");
		
		if(imgSrc != null && imgSrc.trim() != "") {
			$("#"+boxTag).append("<img style='display:none;' onload='Drawing.whenLoadImage(this)' id='imgInCanvas' src='"+imgSrc+"' />")
			//var img=document.getElementById("imgInCanvas");
		}
		
		this.bindEvents();
	},
	whenLoadImage: function(thiz) {
		oThis = Drawing;
		oThis.ctx.drawImage(thiz,0,0);
	},
	
	bindEvents: function() {
		var oThis = Drawing;
		
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
			
			if(oThis.strokeType == "eraser") {
				oThis.ctx.beginPath();
				oThis.ctx.clearRect((oThis.eraseX-oThis.eraseWidth/2)-1, (oThis.eraseY-oThis.eraseHeight/2)-1, Number(oThis.eraseWidth)+2, Number(oThis.eraseHeight)+2);				
				oThis.ctx.closePath();
				oThis.saveDrawingSurface();
			}
		});
	},
	
	whenMouseDown: function(e) {		
		var oThis = Drawing;
		oThis.loc = windowToCanvas(oThis.canvas, e.clientX, e.clientY);
		oThis.preX = oThis.loc.x;
		oThis.preY = oThis.loc.y;		
		oThis.isMouseDown = true;		
	},	
	whenMouseUp: function(e) {
		var oThis = Drawing;
		oThis.isMouseDown = false;
		
		if(oThis.strokeType == "eraser") {
			oThis.loc = windowToCanvas(oThis.canvas, e.clientX, e.clientY);
			oThis.ctx.beginPath();
			oThis.ctx.clearRect((oThis.eraseX-oThis.eraseWidth/2)-1, (oThis.eraseY-oThis.eraseHeight/2)-1, Number(oThis.eraseWidth)+2, Number(oThis.eraseHeight)+2);
			oThis.ctx.clearRect((oThis.loc.x-oThis.eraseWidth/2)-1, (oThis.loc.y-oThis.eraseHeight/2)-1, Number(oThis.eraseWidth)+2, Number(oThis.eraseHeight)+2);
			oThis.ctx.closePath();
			oThis.saveDrawingSurface();		
		}
	},	
	whenMouseMove: function(e) {
		var oThis = Drawing;
		oThis.loc = windowToCanvas(oThis.canvas, e.clientX, e.clientY);
		/*
		console.log(oThis.loc.x + " : " + oThis.loc.y);
		if(oThis.loc.x > oThis.canvas.width || oThis.loc.x < 0 || oThis.loc.y > oThis.canvas.height || oThis.loc.y < 0) {			
			
		}*/
		
		if(oThis.isMouseDown) {
			switch(oThis.strokeType) {
			case "freeLine":
				oThis.drawFreeLine();
				break;
			case "eraser":				
				oThis.eraser();
				oThis.saveDrawingSurface();
				break;
			}	
		} else {			
			switch(oThis.strokeType) {				
			case "eraser":
				oThis.restoreDrawingSurface();
				
				oThis.eraser();		
				break;
			}
			
		}
	},
	
	saveDrawingSurface: function() {
		var oThis = Drawing;
		oThis.drawingSurfaceData = oThis.ctx.getImageData(0, 0, oThis.canvas.width, oThis.canvas.height);
	},
	restoreDrawingSurface: function() {
		var oThis = Drawing;
		oThis.ctx.putImageData(oThis.drawingSurfaceData, 0, 0);
	},
	
	drawFreeLine: function() {
		var oThis = Drawing;
		oThis.ctx.strokeStyle = "black";		
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
	},
	
	eraser: function() {		
		var oThis = Drawing;		
		oThis.ctx.strokeStyle = "gray";
		oThis.ctx.lineWidth = "1";
		oThis.ctx.beginPath();
		oThis.ctx.clearRect((oThis.eraseX-oThis.eraseWidth/2)-1, (oThis.eraseY-oThis.eraseHeight/2)-1, Number(oThis.eraseWidth)+2, Number(oThis.eraseHeight)+2);								
		oThis.ctx.rect(oThis.loc.x-oThis.eraseWidth/2, oThis.loc.y-oThis.eraseHeight/2, oThis.eraseWidth, oThis.eraseHeight);				
		oThis.ctx.closePath();
		oThis.ctx.stroke();
		oThis.eraseX = oThis.loc.x;
		oThis.eraseY = oThis.loc.y;
	},
	
	makeCanvas: function() {		
		var canvas = "";
		canvas += "<canvas id='drawingCanvas' width='"+this.width+"' height='"+this.height+"' style='"+this.canvasStyle+"'>";
		canvas += "</canvas>";
		return canvas;
	},
	
	makeToolBox: function() {		
		var div = "";
		div += "<div style='width:100%;'>";
		div += "<div class='toolBtn' onclick='Drawing.clickFreeLine(this)' style='"+this.toolBtnStyle+" background:red;'>freeLine</div>";
		div += "<div id='txtFreelineWidth' class='toolBtn2' onclick='' style='"+this.toolBtnStyle2+"'>"+this.lineWidth+"</div>";
		div += "<div class='toolBtn2' onclick='Drawing.clickPlusBtn(\"freeline\")' style='"+this.toolBtnStyle2+"'>+</div>";
		div += "<div class='toolBtn2' onclick='Drawing.clickMinusBtn(\"freeline\")' style='"+this.toolBtnStyle2+"'>-</div>";
		div += "<div class='toolBtn' onclick='Drawing.clickEraser(this)' style='"+this.toolBtnStyle+"'>eraser</div>";
		div += "<div id='txtEraserWidth' class='toolBtn2' onclick='' style='"+this.toolBtnStyle2+"'>"+this.lineWidth+"</div>";
		div += "<div class='toolBtn2' onclick='Drawing.clickPlusBtn(\"eraser\")' style='"+this.toolBtnStyle2+"'>+</div>";
		div += "<div class='toolBtn2' onclick='Drawing.clickMinusBtn(\"eraser\")' style='"+this.toolBtnStyle2+"'>-</div>";
		div += "<div class='toolBtn' onclick='Drawing.clickEraseAll(this)' style='"+this.toolBtnStyle+"'>eraseAll</div>";		
		div += "</div>";
		
		return div;
	},
	
	clickFreeLine: function(pThis) {
		var oThis = Drawing;
		oThis.strokeType = "freeLine";
		oThis.resetToolBtn();
		oThis.whenSelectBtn($(pThis));
				
		oThis.ctx.beginPath();
		oThis.ctx.clearRect((oThis.eraseX-oThis.eraseWidth/2)-1, (oThis.eraseY-oThis.eraseHeight/2)-1, Number(oThis.eraseWidth)+2, Number(oThis.eraseHeight)+2);
		oThis.ctx.closePath();
		oThis.saveDrawingSurface();
	},
	
	clickEraseAll: function(pThis) {
		var oThis = Drawing;
		oThis.ctx.clearRect(0, 0, oThis.canvas.width, oThis.canvas.height);
		oThis.saveDrawingSurface();
	},
	
	clickEraser: function(pThis) {
		var oThis = Drawing;
		oThis.strokeType = "eraser";
		oThis.resetToolBtn();
		oThis.whenSelectBtn($(pThis));
		
		oThis.saveDrawingSurface();
	},
	
	clickPlusBtn: function(type) {
		oThis = Drawing;
		switch(type) {
		case "freeline":
			oThis.lineWidth++;
			oThis.resetTxtFreelineWidth();
			break;
		case "eraser":
			oThis.eraseWidth++;
			oThis.eraseHeight++;
			oThis.resetTxtEraserWidth();
			break;
		}
	},
	
	clickMinusBtn: function(type) {
		oThis = Drawing;
		switch(type) {
		case "freeline":
			oThis.lineWidth--;
			oThis.resetTxtFreelineWidth();
			break;
		case "eraser":
			oThis.eraseWidth--;
			oThis.eraseHeight--;
			oThis.resetTxtEraserWidth();
			break;
		}
	},
	
	resetTxtFreelineWidth: function() {
		$("#txtFreelineWidth").text(oThis.lineWidth);
	},
	resetTxtEraserWidth: function() {
		$("#txtEraserWidth").text(oThis.eraseWidth);
	},
	
	resetToolBtn: function() {
		$(".toolBtn").css("background", "white");
	},
	
	whenSelectBtn: function($btn) {
		$btn.css("background", "red");
	}
	
}


















