import { getImg } from "../utility.js";
import { Button } from "./Button.js";

export function closingButton() {
    let button = new Button()
        .setSize(0.5, 0.5)
        .setPosition(.7, .2)
        .positionFromRight()

        .setText("X", 0.3)
        .addAction(() => { button.parent.close() })
        .setBackGround(getImg("background"))
    return button
}