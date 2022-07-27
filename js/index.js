let deathData

(async () => {
    const response = await fetch('js/deathData.json')
    deathData = await response.json()
})()

function getDeathChance(age, sex) {
    const deathChance = parseFloat(deathData[age][sex])
    return deathChance
}

function simulate(desiredAge, sex) {
    const startTime = new Date()
    const sampleSize = 20000
    let age = 0
    let maxAge = 0
    let lifetimes = 0
    let reachedDesiredAge = 0

    while(lifetimes <= (sampleSize - 1)) {
        let deathChance = getDeathChance(age, sex)

        // if they reach the desired age
        if(age === desiredAge) {
            if(age > maxAge) {
                maxAge = age
            }

            age = 0
            reachedDesiredAge += 1
            lifetimes += 1
            continue
        }

        // if they die
        if((Math.random() <= deathChance)) {
            if(age > maxAge) {
                maxAge = age
            }

            age = 0
            lifetimes += 1
            continue
        }

        // if they survive
        age += 1
    }

    const endTime = new Date()

    const data = {
        timeElapsed: `${(endTime - startTime) / 1000}`,
        desiredAge: `${desiredAge}`,
        maxAge: `${maxAge}`,
        lifetimes: `${lifetimes}`,
        reachedDesiredAge: `${reachedDesiredAge}`,
        percentReached: `${Math.floor(reachedDesiredAge / lifetimes * 1000) / 10}`
    }

    return data
}

document.querySelector('main form').addEventListener('submit', e => {
    e.preventDefault()
    const desiredAge = document.querySelector('input#age').value
    const sex = document.querySelector('select#sex').value
    const result = simulate(parseInt(desiredAge), sex)
    const resultField = document.querySelector('#results')

    let sexForm
    if (parseInt(result['reachedDesiredAge']) === 1) {
        sexForm = `${sex}`
    } else {
        sexForm = `${sex}s`
    }

    let yearForm
    if (parseInt(result['desiredAge']) === 1) {
        yearForm = 'year'
    } else {
        yearForm = 'years'
    }

    resultField.innerHTML = 
        `The simulation took ${result['timeElapsed']} seconds to complete. <br/>
        Out of ${result['lifetimes']} lifetimes, ${result['reachedDesiredAge']} ${sexForm} reached ${result['desiredAge']} ${yearForm} old (${result['percentReached']}%)!`
})