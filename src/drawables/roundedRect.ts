import { DefaultDrawable } from "./shape.js";
import { Vec2, Vector2 } from "../stl/vec2.js";
export class RoundedRectangle extends DefaultDrawable{
    static create(
        x:number, y:number,
        w:number, h:number,
        r1:number, r2:number, r3:number, r4:number
    ) {
        let points: Vector2[] = []
        if(r1+r2 > w || r1+r3 > h || r2+r4 > h || r3+r4 > w) {
            throw Error('invalid radius')
        }

        // RoundedRectangle.arc(x+w-r2, y+r2, r2, 180, 270).forEach(e=>{
        //     points.push(e)
        // })
        points = points.concat(RoundedRectangle.arc(x+w-r2, y+r2, r2, -90, 90))
        points = points.concat(RoundedRectangle.arc(x+w-r3, y+h-r3, r3, 0, 90))
        points = points.concat(RoundedRectangle.arc(x+r4, y+h-r4, r4, 90, 90))
        points = points.concat(RoundedRectangle.arc(x+r1, y+r1, r1, 180, 90))

        return new RoundedRectangle(points)
    }

    static arc(
        x:number, y:number, r:number, startAngle:number, angle:number
    ){
        const species = Math.floor(1/4 * Math.PI * r)
        let dTheta = Math.PI * angle/180 / species 
        let tempPoints: Vector2[] = []
        for(let i = 0; i <= species; i++) {
            let theta = startAngle * Math.PI / 180 + i * dTheta
            let x1 = x + r * Math.cos(theta)
            let y1 = y + r * Math.sin(theta)
            tempPoints.push(Vec2.from(x1, y1))
        }
        return tempPoints
    }
}