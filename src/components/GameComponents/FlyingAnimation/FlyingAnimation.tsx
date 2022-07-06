import React, { FC, memo, useEffect } from 'react'

const FlyingAnimation: FC<{ numberOfBalloons?: number; src?: string }> = ({
  numberOfBalloons = 1,
  src = '',
}) => {
  useEffect(() => {
    function random(num: number) {
      return Math.floor(Math.random() * num)
    }

    function getRandomStyles() {
      const mt = random(100)
      const ml = random(50) + 10
      const dur = random(4) + 2
      return `
      margin: ${mt}px 0 0 ${ml}px;
      animation: float ${dur}s ease-in infinite
      `
    }

    function createBalloons(num: number) {
      let balloonContainer = document.getElementById('balloon-container')
      for (let i = 0; i < num; i++) {
        let balloon = document.createElement('div')
        let image = document.createElement('img')
        balloon.className = 'balloon'
        image.src = src
        image.style.width = '100%'
        image.style.height = '100%'
        balloon.style.cssText = getRandomStyles()
        balloon.appendChild(image)
        balloonContainer?.append(balloon)
      }
    }

    createBalloons(numberOfBalloons)
  }, [src])

  return <div id="balloon-container"></div>
}

export default memo(FlyingAnimation)
