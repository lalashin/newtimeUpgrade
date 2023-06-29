let weight = 29
try {
    //소스코드를 쓴다.
    //이안에서 에러가 발생하면
    console.log("ㅋㅋㅋ")
    if (weight < 30) {
        throw new Error("당신은 너무말랐어")
    }

    console.log("배불러")
} catch (error) {
    //catch가 에러를 잡아준다.
    console.log("내가 잡은 에러는", error.message)
}