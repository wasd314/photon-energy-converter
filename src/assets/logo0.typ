#import "@preview/cetz:0.3.3"

// generate with:
// typst compile --format png src/assets/logo0.typ public/logo0.png

#let target-px = 1024
#let ppi = 144
#let page-size = target-px / ppi * 1in
#set page(height: page-size, width: page-size, margin: 0pt)
#show: align.with(center + horizon)

#let canvas-size = page-size * 80%
#set text(size: canvas-size * 40%, font: "Noto Sans CJK JP", weight: 900)
#cetz.canvas(length: canvas-size, debug: false, {
  import cetz.draw: content
  let us = ([J], [eV], [nm], [T])
  let fil = (red, black, black, black)
  let siz = (2.3em, 0.94em, 1em, 1.9em)
  let pos = ((0, 1), (0.97, 1), (0, 0), (1, 0))
  let anchors = ("north-west", "north-east", "south-west", "south-east")
  for i in range(4) {
    let tx = text(fill: fil.at(i), size: siz.at(i), us.at(i))
    content(pos.at(i), anchor: anchors.at(i), box(tx))
  }
})
