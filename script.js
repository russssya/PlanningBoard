var canvasHeight=window.innerHeight
var canvasWidth=window.innerWidth
const board=document.getElementById("board")

var stage=new Konva.Stage({
    container: 'board',
    width: canvasWidth,
    height: canvasHeight
})

var layerRect, layerSquare, layerCircle, layerText, layerA

document.getElementById("but_clear").addEventListener("click", ()=>{
    stage.destroyChildren()
})

document.getElementById("but_save").addEventListener("click", ()=>{
    var data=stage.toDataURL({pixelRatio:3})
    var a=document.createElement("a")
    a.download="myBoard"
    a.href=data
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    delete a
})

let colors=document.querySelectorAll(".color")
var fillColor='black'
colors=Array.from(colors)
colors.forEach(color=>{
    color.addEventListener("click", ()=>{
        fillColor=color.dataset.color
    })
})


//Layer for drawing by pencil
let but_pencil=document.getElementById("but_pencil")
let but_cancel=document.getElementById("but_cancel")
var stroke_flag=false
var drawing=false
var stop_drawing
var line

document.getElementById("width-1").addEventListener("click", ()=>{
    strokeW=15
})
document.getElementById("width-2").addEventListener("click",()=>{
    strokeW=10
})
document.getElementById("width-3").addEventListener("click", ()=>{
    strokeW=8
})
document.getElementById("width-4").addEventListener("click", ()=>{
    strokeW=5
})

but_pencil.addEventListener("click", ()=>{
    layerA=new Konva.Layer({
        dragCursor: 'none'
    })
    stage.add(layerA)
    stop_drawing=false
    but_cancel.style.display="flex"
    stroke_flag=!stroke_flag
    OpenOrCloseElement(stroke_flag, document.getElementById("menu_stroke"))

    stage.on('mousedown touchstart', ()=>{
        drawing=true
        var pos=stage.getPointerPosition()
        line=new Konva.Line({
            stroke: fillColor,
            strokeWidth: strokeW,
            lineCap: 'round',
            lineJoin: 'round',
            points: [pos.x, pos.y]
        })
        layerA.add(line)
    })
    
    stage.on('mouseup touchend', ()=>{
        drawing=false
    })
    
    stage.on('mousemove touchmove', ()=>{
        if(!drawing||stop_drawing) return
        
        const pos=stage.getPointerPosition()
        var newPoints=line.points().concat(pos.x, pos.y)
        line.points(newPoints)
        layerA.batchDraw()
    })
})


but_cancel.addEventListener("click",()=>{
    stop_drawing=!stop_drawing
    but_cancel.style.display="none"
})


//Layer for drawing figures
var flag_menu=false, flag_transform=false
var strokeW=5
var square,rect, circle, transformer

function addTransformer(layer, figure, flag){
    if(flag){
        transformer=new Konva.Transformer()
        layer.add(transformer)
        transformer.nodes([figure])
    }
    else{
        transformer.nodes([])
    }
}

function OpenOrCloseElement(flag, element){
    if(!flag){
        element.style.display="none"
    }
    else{
        element.style.display="flex"
    }
}

document.getElementById("but_figures").addEventListener("click",()=>{
    flag_menu=!flag_menu
    OpenOrCloseElement(flag_menu, document.getElementById("menu_figures"))
})

document.getElementById("but_square").addEventListener("click", ()=>{
    square=new Konva.Rect({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        stroke: 'black',
        fill: fillColor,
        strokeWidth: strokeW,
        draggable: true
    })
    layerSquare=new Konva.Layer()
    layerSquare.add(square)
    square.addEventListener("click", ()=>{
        flag_transform=!flag_transform
        addTransformer(layerSquare,square,flag_transform)
    })
    stage.add(layerSquare)
})

document.getElementById("but_circle").addEventListener("click", ()=>{
    circle=new Konva.Circle({
        x: 400,
        y: 200,
        radius: 80,
        draggable: true,
        stroke: 'black',
        fill: fillColor,
        strokeWidth: strokeW
    })
    layerCircle=new Konva.Layer()
    layerCircle.add(circle)
    circle.addEventListener("click",()=>{
        flag_transform=!flag_transform
        addTransformer(layerCircle,circle,flag_transform)
    })
    stage.add(layerCircle)
})

document.getElementById("but_rectangle").addEventListener("click", ()=>{
    rect=new Konva.Rect({
        x: 500,
        y: 200,
        width: 300,
        height: 200,
        stroke: 'black',
        fill: fillColor,
        strokeWidth: strokeW,
        draggable: true
    })
    layerRect=new Konva.Layer()
    layerRect.add(rect)
    rect.addEventListener("click", ()=>{
        flag_transform=!flag_transform
        addTransformer(layerRect,rect,flag_transform)
    })
    
    stage.add(layerRect)
})

//Layer for add stickers
var flag_menu_stick=false, flag_transform_stick=false
document.getElementById("but_stickers").addEventListener("click", ()=>{
    flag_menu_stick=!flag_menu_stick
    OpenOrCloseElement(flag_menu_stick, document.getElementById("menu_stickers"))
})

function addSticker(path){
    var layerImage=new Konva.Layer()
    Konva.Image.fromURL(path, function(red_stick){
        red_stick.setAttrs({
            x: 500,
            y: 200,
            draggable: true
        })
        layerImage.add(red_stick)
        red_stick.addEventListener("click", ()=>{
            flag_transform_stick=!flag_transform_stick
            addTransformer(layerImage,red_stick,flag_transform_stick)
        })
    })
    stage.add(layerImage)
}

document.getElementById("red_sticker").addEventListener("click", ()=>{
    addSticker('/images/red_sticker.png')
})

document.getElementById("blue_sticker").addEventListener("click", ()=>{
    addSticker('/images/blue_sticker.png')
})

document.getElementById("yellow_sticker").addEventListener("click", ()=>{
    addSticker('/images/yellow_sticker.png')
})

document.getElementById("green_sticker").addEventListener("click", ()=>{
    addSticker('/images/green_sticker.png')
})


//Layer for add text
var textString, textBlock, flag_transform_text=false

document.getElementById("but_text").addEventListener("click", ()=>{
    var textarea=document.createElement("textarea")
    textarea.name="post"
    textarea.maxLength="5000"
    textarea.style.position="absolute"
    textarea.style.display="block"
    textarea.style.border="none"
    textarea.cols="20"
    textarea.rows="5"
    textarea.style.marginTop="-400px"
    textarea.style.marginLeft="600px"
    textarea.placeholder="Введіть текст"
    board.appendChild(textarea)
    textarea.addEventListener("keyup", (e)=>{
        if(e.code==='Enter'){
            textString=textarea.value
            textarea.style.display="none"
            textBlock=new Konva.Text({
                x: 400,
                y: 300,
                text: textString,
                fontSize: 30,
                fill: fillColor,
                draggable: true
            })
            layerText=new Konva.Layer()
            layerText.add(textBlock)
            textarea.addEventListener("click", ()=>{
                flag_transform_text=!flag_transform_text
                addTransformer(layerText, layerText, flag_transform_text)
            })
            stage.add(layerText)
        }
    })
})

//Layer for to do list and kanban
function addSample(path){
    var layerSample=new Konva.Layer()
    Konva.Image.fromURL(path, function(image){
        image.setAttrs({
            x: 100,
            y: 0
        })
        layerSample.add(image)
    })
    stage.add(layerSample)
}

document.getElementById("but_to_do").addEventListener("click", ()=>{
    addSample('/images/to do list.png')
})

document.getElementById("but_kanban").addEventListener("click", ()=>{
    addSample('/images/kanban board.png')
})

//Layer for add images
var flag_transform_image=false
function addImage(){
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    var layerImage=new Konva.Layer()
    stage.add(layerImage)

    input.addEventListener('change', function() {
        var file = this.files[0]
        var reader = new FileReader()
      
        reader.addEventListener('load', function() {
            var imageObj = new Image()
            imageObj.onload = function(){
                var image = new Konva.Image({
                    image: imageObj,
                    draggable: true,
                    x: 300,
                    y: 300,
                    width: 400,
                    height: 500
                })
                layerImage.add(image)
                layerImage.draw()
                image.addEventListener("click", ()=>{
                    flag_transform_image=!flag_transform_image
                    addTransformer(layerImage, image, flag_transform_image)
                })
            }
            imageObj.src = reader.result
        })
        reader.readAsDataURL(file)
      })

    document.body.appendChild(input)
    input.click()
}

document.getElementById("but_image").addEventListener("click", ()=>{
    addImage()
})

//Context_menu
var context_menu=document.getElementById("context_menu")
var currentElement
document.getElementById("delete_element").addEventListener("click", ()=>{
    currentElement.destroy()
})
window.addEventListener("click", ()=>{
    context_menu.style.display="none"
})

stage.on('contextmenu', (e)=>{
    e.evt.preventDefault()
    if(e.target===stage) return
    
    currentElement=e.target
    context_menu.style.display='initial'
    var containerRect=stage.container().getBoundingClientRect()
    context_menu.style.top=containerRect.top+stage.getPointerPosition().y+4+'px'
    context_menu.style.left=containerRect.left+stage.getPointerPosition().x+4+'px'
})
