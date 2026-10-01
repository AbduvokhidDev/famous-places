
function kechiktrilganSon(son){
    return new Promise((resolve)=>{
        setTimeout(()=>resolve(son),1000)
    }) 
}


async function sonniTop() {
    try {
        const res = await kechiktrilganSon(10)
        const total = res *2
        console.log(total)
    } catch (error) {
        console.log(error.message)
    }
}
sonniTop()
