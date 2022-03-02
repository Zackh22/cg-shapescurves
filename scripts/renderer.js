class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }

    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        let left_bottom = { x: 100, y: 200 };
        let right_top = { x: 300, y: 500 };

        this.drawRectangle(left_bottom, right_top, [0, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        let center = {x: 250, y: 250};
        this.drawCircle(center, 100, [0,0,0, 255], ctx);

    }

    // ctx:          canvas context
    drawSlide2(ctx) {

        let pt0 = {x: 100, y: 200};
        let pt1 = {x: 300, y: 500};
        let pt2 = {x: 350, y: 250};
        let pt3 = {x: 180, y: 200};

        this.drawBezierCurve(pt0, pt1, pt2, pt3, [0, 0, 0, 255], ctx);

    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        // Z
        this.drawLine({x:50, y: 500}, {x: 150, y: 500}, [255,0,255,255], ctx);
        this.drawLine({x: 150, y: 500}, {x: 50, y: 300}, [255,0,255,255], ctx);
        this.drawLine({x:50, y: 300}, {x: 150, y: 300}, [255,0,255,255], ctx);
        // a
        this.drawCircle({x: 200, y: 355}, 50, [255,0,255,255], ctx);
        this.drawLine({x:250, y:300}, {x: 250, y: 400}, [255,0,255,255], ctx);

        // c
        this.drawBezierCurve({x: 340, y: 395}, {x: 250, y: 390}, {x: 250, y: 310}, {x: 340, y: 305}, [255,0,255,255], ctx);

        // k
        this.drawLine({x: 375, y: 300}, {x: 375, y: 500}, [255,0,255,255], ctx);
        this.drawLine({x: 375, y: 360}, {x: 425, y: 450}, [255,0,255,255], ctx);
        this.drawLine({x: 375, y: 360}, {x: 425, y: 300}, [255,0,255,255], ctx);


    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        let y0 = left_bottom.y;

        let x1 = right_top.x;
        let y1 = right_top.y;

        // draw line between the four points

        // left line
        this.drawLine(left_bottom, { x: left_bottom.x, y: y1 }, color, ctx);

        // top line
        this.drawLine({ x: left_bottom.x, y: y1 }, right_top, color, ctx);

        // right line
        this.drawLine(right_top, { x: x1, y: y0 }, color, ctx);

        // bottom line
        this.drawLine(left_bottom, { x: x1, y: y0 }, color, ctx);

        if (this.show_points) {
            let dataPointColor = [255, 0, 0, 255];
            this.showDataPoints({x: left_bottom.x, y: left_bottom.y}, dataPointColor, ctx);
            this.showDataPoints({x: left_bottom.x, y: right_top.y}, dataPointColor, ctx);
            this.showDataPoints({x: right_top.x, y: right_top.y}, dataPointColor, ctx);
            this.showDataPoints({x: right_top.x, y: left_bottom.y}, dataPointColor, ctx);
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        let dataPointColor = [255, 0, 0, 255];
        let degree = 0;
        // need to account for the slider
        let increaseDegreeBy = 2 * Math.PI/this.num_curve_sections;
        let prev_x = center.x + radius * Math.cos(degree);
        let prev_y = center.y + radius * Math.sin(degree);
        let i = 1;
        let cur_x =0;
        let cur_y = 0;
        while(i <= this.num_curve_sections){
            degree = degree + increaseDegreeBy;
            cur_x = center.x + radius * Math.cos(degree);
            cur_y = center.y + radius * Math.sin(degree);
            //Draws the Circle
            this.drawLine({x:prev_x, y: prev_y}, {x:cur_x, y: cur_y}, color, ctx);

            if(this.show_points){
                this.showDataPoints({x: cur_x, y: cur_y}, dataPointColor, ctx);
            }

            prev_x = cur_x;
            prev_y = cur_y;

            i = i+1;
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        let x0 = pt0.x;
        let y0 = pt0.y;

        let x1 = pt1.x;
        let y1 = pt1.y;

        let x2 = pt2.x;
        let y2 = pt2.y;

        let x3 = pt3.x;
        let y3 = pt3.y;

        let increaseBy = 1/this.num_curve_sections;
        //console.log(increaseBy);
        let t = 0.0;
        let prev_x = x0;
        let prev_y = y0;
        while(t <= 1.001){
            let new_x = Math.pow(1-t, 3) * x0 + 3 * Math.pow(1-t, 2) * t * x1 + 3 * (1-t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
            let new_y = Math.pow(1-t, 3) * y0 + 3 * Math.pow(1-t, 2) * t * y1 + 3 * (1-t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y3;
            this.drawLine({x: prev_x, y: prev_y}, {x: new_x, y: new_y}, color, ctx);
            if(this.show_points){
                this.showDataPoints({x: new_x, y: new_y}, [255, 0, 0, 255], ctx);
            }
            prev_x = new_x;
            prev_y = new_y;
            t = t + increaseBy;
        }
        console.log(t);
        if(this.show_points){
            this.showDataPoints({x: pt0.x, y: pt0.y}, [0, 0, 255, 255], ctx);
            this.showDataPoints({x: pt1.x, y: pt1.y}, [0, 0, 255, 255], ctx);
            this.showDataPoints({x: pt2.x, y: pt2.y}, [0, 0, 255, 255], ctx);
            this.showDataPoints({x: pt3.x, y: pt3.y}, [0, 0, 255, 255], ctx);
        }

    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx) {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }

    showDataPoints(point, color, ctx) {
        this.drawLine({x: point.x - 1, y: point.y - 1}, {x: point.x - 1, y: point.y + 1}, color, ctx);
        this.drawLine({x: point.x - 1, y: point.y + 1}, {x: point.x + 1, y: point.y + 1}, color, ctx);
        this.drawLine({x: point.x + 1, y: point.y + 1}, {x: point.x + 1, y: point.y - 1}, color, ctx);
        this.drawLine({x: point.x - 1, y: point.y - 1}, {x: point.x + 1, y: point.y - 1}, color, ctx);
    }
};
