<template>
	<div id="app">
		<div class="frame">
			<canvas ref="tutorial" width="600" height="600"></canvas>
			<div class="display-card" ref="display-card">
				<div class="nav-container">
					<ul class="nav-group" ref='nav-group'>
						<li>Dashboard</li>
						<li>Profile</li>
						<li>Notifications</li>
						<li>Messages</li>
						<li>Settings</li>
					</ul>
				</div>
				<div class="banner">
					<div class='hamburger-menu' ref="hamburger-menu">
						<div></div>
						<div></div>
					</div>
					<h3>Notifications</h3>
				</div>
				<div class="content" ref="content">
					<ol>
						<li>
							<span>9:24 AM</span>
							<span>Drew Magoo Bubbaloo</span>
							<span>Posted a photo on your wall</span>
						</li>
						<li>
							<span>8:19 AM</span>
							<span>Ralph Waldo PickleChips</span>
							<span>commented on your last post</span>
						</li>
						<li>
							<span>Yesterday</span>
							<span>Poot McScooter</span>
							<span>added you as a friend</span>
						</li>
					</ol>
				</div>
			</div>
		</div>

		<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
		  <defs>
		    <filter id="goo" x="-50%" y="-50%" width="500%" height="500%">
		 		<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
		      <feColorMatrix in="blur" mode="matrix" 
		                      values="1 0 0 0 0  
		                              0 1 0 0 0  
		                              0 0 1 0 0  
		                              0 0 0 20 -6" result="goo" />
		      <feBlend in="SourceGraphic" in2="goo" />
				</filter>
		  </defs>
		</svg>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from './main.js'
export default {
	name: 'app',
	data() {
		return {
			canvas: this.$refs['tutorial'],
			ctx: null,
			rows: 40,
			columns: 30,
			squares: [],
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			cubesTop: 100,
			cubesLeft: 80,
			animationDuration: 300,
			opacityTickAll: this.getPropertyIncrement(0, 1, 500),
			opacityAll: 1,
			dir: 'closed',
			currentFrame: null
		}
	},
	mounted() {
		//set fallback if request animation frame is not supported/defined
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(cb) {
				setTimeout(() => cb(new Date()), 1000 / 60)
			}
		}

		this.ctx = this.$refs['tutorial'].getContext('2d')
		const that = this
		let index = 0
		if (this.ctx) {
			this.ctx.translate(this.cubesLeft, this.cubesTop)//this.cubesTopLeft, this.cubesTopLeft)
			for (var row = 0; row < this.rows; row++) {
				this.squares[row] = this.squares[row] || []
				for (let column = 0; column < this.columns; column ++) {
					index++
					let square = new this.Square(that, row, column, index)
					this.squares[row].push(square)
					this.ctx.save()
					this.ctx.translate((column * square.width), (row * square.height))
					this.ctx.transform(-1, 0, 0, 1, this.squares[row][column].currentX || 0, this.squares[row][column].currentY || 0)
					this.ctx.fillStyle = `rgb(${Math.random() * 155 + 100},${Math.random() * 155 + 100},${Math.random() * 155 + 100}, 0)`
					this.ctx.fillRect(0, 0, square.width, square.width);
					this.ctx.restore()
				}
			} 
		}
		this.$refs['hamburger-menu'].addEventListener('click', this.hamburgerMenuClick)
		this.$refs['display-card'].addEventListener('transitionend', this.displayCardTransitionCB)
	},
	computed: {
		...mapGetters([]),
	},
	methods: {
		hamburgerMenuClick() {
			if (this.dir == 'opened' || this.dir == 'opening') {
				this.dir = 'closing'
				this.$refs['nav-group'].style.opacity = 0;
				this.fadeSquares()
			} else if (this.dir == 'closed' || this.dir == 'closing') {
				this.dir = 'opening';
				this.$refs['display-card'].style.left = '90%'
			}
		},
		displayCardTransitionCB(event) {
			if (event.propertyName == 'left') {
				if (this.dir == 'opening') {
					this.dir = 'opened'
					this.beginAnimation()
				} else if (this.dir == 'closing') {
					this.dir = 'closed'
				}
			}
		},
		beginAnimation() {
			//cancel current frame to prevent function stacking when changing directions
			window.cancelAnimationFrame(this.currentFrame)
			this.currentFrame = window.requestAnimationFrame(timestamp => {
				this.startTimeStamp = timestamp || new Date().getTime() //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
				this.translateSquares(this.startTimeStamp);
			});
		},
		async translateSquares(timeStamp) {
			const that = this;
			let isAnimationCompleted = true;
			if (this.ctx) {
				// clear the canvas
				await this.ctx.translate(-this.cubesLeft, -this.cubesTop)
				await this.ctx.clearRect(0, 0, 800, 800)
				await this.ctx.translate(this.cubesLeft, this.cubesTop)
				for (var row = 0; row < this.rows; row++) {
					for (let column = 0; column < this.columns; column ++) {
						let square = this.squares[row][column]
						square.doneAnimating = false
						if (this.dir == 'opened') {
							if (square.currentEnterDelay > 0) {
								square.currentEnterDelay = square.currentEnterDelay - (1000/60)
								isAnimationCompleted = false
							} else {
								square.currentEnterDelay = 0;
								square.currentX = square.currentX + square.xTick
								square.currentY = square.currentY + square.yTick
								//has reached the center
								if ((square.xTransform < 0  && square.currentX >= 0) || (square.xTransform > 0  && square.currentX <= 0)) {
									square.currentX = 0
								}
								if ((square.yTransform < 0 && square.currentY >= 0) || (square.yTransform > 0  && square.currentY <= 0)) {
									square.currentY = 0
								}
								if (square.opacity < 1) square.opacity = square.opacity + (square.opacityTick * 0.5)
								else square.opacity = 1
								if (square.currentX == 0 && square.currentY == 0) {
									if (square.currentLeaveDelay < square.leaveDelay) {
										square.currentLeaveDelay = square.currentLeaveDelay + (1000/60)
									} else {
										square.currentLeaveDelay = square.leaveDelay
										square.doneAnimating = true
									}
								}
							}
						} else if (this.dir == 'closing') {
							if (square.currentLeaveDelay > 0) {
								square.currentLeaveDelay = square.currentLeaveDelay - (1000/60)
								isAnimationCompleted = false
							} else {
								square.currentLeaveDelay = 0;
								square.currentX = square.currentX - square.xTick
								square.currentY = square.currentY - square.yTick
								if ((square.xTransform < 0 && square.currentX <= square.xTransform) || (square.xTransform > 0  && square.currentX >= square.xTransform)) {
									square.currentX = square.xTransform
								}
								if ((square.yTransform < 0 && square.currentY <= square.yTransform) || (square.yTransform > 0  && square.currentY >= square.yTransform)) {
									square.currentY = square.yTransform
								}
								if (square.opacity > 0) square.opacity = square.opacity - (square.opacityTick * 2)
								else { square.opacity = 0 }
								if (square.currentX == square.xTransform && square.currentY == square.yTransform) {
									if (square.currentEnterDelay < square.enterDelay) {
										square.currentEnterDelay = square.currentEnterDelay + (1000/60)
									} else {
										square.currentEnterDelay = square.enterDelay
										square.doneAnimating = true
									}
								}
							}
						}
						if (!square.doneAnimating) {
							isAnimationCompleted = false
						}
						await this.ctx.save();
						await this.ctx.translate((column * square.width), (row * square.height));
						await this.ctx.transform(-1, 0, 0, 1, this.squares[row][column].currentX || 0, this.squares[row][column].currentY || 0);
						this.ctx.fillStyle = `rgb(0,0,0, ${square.opacity})`;
						await this.ctx.fillRect(0, 0, square.width, square.height);
						await this.ctx.restore();
					}
				}
				if (!isAnimationCompleted) {
					that.currentFrame = window.requestAnimationFrame(this.translateSquares);
				} else if (this.dir == 'closing') {
					this.$refs['display-card'].style.left = '50%'
				} else if (this.dir == 'opened') {
					this.$refs['nav-group'].style.opacity = 1;
					that.currentFrame = window.requestAnimationFrame(this.fadeSquares);
				}
			}
		},
		async fadeSquares() {
			debugger;
			let isAnimationCompleted = false;
			if (this.ctx) {
				// clear the canvas
				await this.ctx.translate(-this.cubesLeft, -this.cubesTop)
				await this.ctx.clearRect(0, 0, 800, 800)
				await this.ctx.translate(this.cubesLeft, this.cubesTop)
				
				if (this.dir == 'opened') {
					this.opacityAll = this.opacityAll - this.opacityTickAll
					if (this.opacityAll <= 0) {
						this.opacityAll = 0
						isAnimationCompleted = true;
					}
				}
				if (this.dir == 'closing') {
					this.opacityAll = this.opacityAll + this.opacityTickAll
					if (this.opacityAll >= 1) {
						this.opacityAll = 1
						isAnimationCompleted = true;
					}
				}
				await this.ctx.save();
				// await this.ctx.translate(-10, 0)
				// await this.ctx.transform(-1, 0, 0, 1, this.squares[row][column].currentX || 0, this.squares[row][column].currentY || 0);
				this.ctx.fillStyle = `rgb(0,0,0, ${1})`;
				await this.ctx.fillRect(0, 0, this.squares[0].length * this.squares[0][0].width, this.squares.length * this.squares[0][0].height);
				await this.ctx.restore();
			}
			if (!isAnimationCompleted) {
				this.currentFrame = window.requestAnimationFrame(this.fadeSquares)
			} else if (this.dir == 'closing') {
				this.currentFrame = window.requestAnimationFrame(this.translateSquares)
			}
		},
		getDegressFromRadian(deg) {
			return (Math.PI/180) * deg;
		},
		getPropertyIncrement(startValue, endValue, duration) {
			const TICK_TIME = 1000 / 60; //to achieve 60fps, 1 frame needs to render every 16ms
			const ticksToComplete = duration / TICK_TIME;
			return  (endValue - startValue) / ticksToComplete; //return the value that will be incremented each tick of the animation
		},
		Square: function(that, row, column, index) {
			this.height = 10
			this.width = 10
			//+ or - 1 to invert the x or y transform used for randomness
			let xInvert = Math.random() * 10 > 5 ? -1 : 1;
			let yInvert = Math.random() * 10 > 5 ? -1 : 1;

			//dimensions of 
			let totalWidth = that.columns * this.width
			let totalHeight = that.rows * this.height

			let currentColumn = column - (that.columns/2) + 0.5
			let columnRange = (that.columns/2) + 0.5
			let isOddColumns = that.columns % 2 == 1
			if (isOddColumns) {
				currentColumn = column - Math.floor(that.columns/2)
				columnRange = Math.floor(that.columns/2)
			}
			
			let currentRow = row - (that.rows/2) + 0.5
			let rowRange = (that.rows/2) + 0.5
			let isOddRows = that.rows % 2 == 1
			if (isOddRows) {
				currentRow = row - Math.floor(that.rows/2)
				rowRange = Math.floor(that.rows/2)
			}

			let distanceMultiplierFromOrigin = 0.5
			let randomMultipler = 30

			let leftRightXTranslation = that.map(currentColumn, -columnRange, 0, -this.width * that.columns, -this.width * that.columns)
			let leftRightYTranslation = that.map(currentRow, -rowRange, rowRange, -this.height * that.rows, this.height * that.rows)

			let topBottomYTranslation = that.map(currentRow, -rowRange, 0, -this.height * that.rows, -this.height * that.rows)
			let topBottomXTranslation = that.map(currentColumn, -columnRange, columnRange, -this.width * that.columns, this.width * that.columns)

			let randomY = Math.random() * randomMultipler
			let randomX = Math.random() * randomMultipler + 1

			if (currentRow < 0) {
				let val = that.map(currentRow, 0, -(that.rows/2), 0, (that.columns/2))
				if (currentColumn <= val && currentColumn >= -val) {
					//this is the upper triangle of values
					this.xTransform = topBottomXTranslation + that.map(randomX, 0 , randomMultipler, 0, this.width * that.columns) * xInvert
					this.yTransform = topBottomYTranslation - that.map(randomY, 0, randomMultipler, 0, this.height * that.rows)
				}
			} else if (currentRow > 0) {
				let val = that.map(currentRow, 0, (that.rows/2), 0, (that.columns/2))
				if (currentColumn <= val && currentColumn >= -val) {
					//this is the lower triangle of values
					this.xTransform = topBottomXTranslation + that.map(randomX, 0 , randomMultipler, 0, this.width * that.columns) * xInvert
					this.yTransform = -topBottomYTranslation + that.map(randomY, 0, randomMultipler, 0, this.height * that.rows)
				}
			}

			if (currentColumn < 0) {
				//this is the left triangle
				let val = that.map(currentColumn, 0, (that.columns/2), 0, (that.rows/2))
				if (currentRow > val && currentRow < -val) {
					this.xTransform = leftRightXTranslation - that.map(randomX, 0, randomMultipler, 0, this.width * that.columns)
					this.yTransform = leftRightYTranslation + that.map(randomY, 0, randomMultipler, 0, this.height * that.rows) * yInvert
				}
			} else if (currentColumn > 0) {
				//this is the right triangle
				let val = that.map(currentColumn, 0, (that.columns/2), 0, (that.rows/2))
				if (currentRow > -val && currentRow < val) {
					that.right++;
					this.xTransform = -leftRightXTranslation + that.map(randomX, 0, randomMultipler, 0, this.width * that.columns)
					this.yTransform = leftRightYTranslation + that.map(randomY, 0, randomMultipler, 0, this.height * that.rows) * yInvert
				}
			}


			this.currentX = this.xTransform
			this.currentY = this.yTransform
			this.xTick = that.getPropertyIncrement(this.xTransform, 0, that.animationDuration)
			this.yTick = that.getPropertyIncrement(this.yTransform, 0, that.animationDuration)
			this.opacityTick = that.getPropertyIncrement(0, 1, that.animationDuration)
			this.enterDelay = that.map(index, 1, that.rows * that.columns, 0, 500) + (Math.random() * 200)
			this.leaveDelay = 700 - this.enterDelay
			this.currentEnterDelay = this.enterDelay
			this.currentLeaveDelay = 0
			this.opacity = 0
			this.doneAnimating = false

		},
		map(x,  in_min,  in_max,  out_min,  out_max){
			return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		}
	}
};
</script>
<style lang="scss">
canvas {
	position: absolute;
	// border: 3px solid red;
	// z-index: 100;
}
// delete the following line if no text is used
// edit the line if you wanna use other fonts
@import url(https://fonts.googleapis.com/css?family=Open+Sans:700,300);

// use only the available space inside the 400x400 frame
.frame {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 600px;
	height: 600px;
	margin-top: -300px;
	margin-left: -300px;
	border-radius: 2px;
	box-shadow: 4px 8px 16px 0 rgba(0,0,0,0.1);
	overflow: hidden;
	background: #fff;
	color: #333;
	background-color: #264057;
	font-family: 'Open Sans', Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

*{
	box-sizing: border-box;
}

//colors
$banner-color: #5F98CD;


.display-card {
	$display-height: 450px;
	$display-border-radius: 10px;
	width: 450px;
	height: $display-height;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	display: flex;
	flex-direction: column;
	transition: all 1s ease-in-out;
	.nav-container {
		position: absolute;
		left: 0%;
		transform: translateX(-99%) translateY(25px);
		width: 240px;
		height: 400px;
		.particle-container {
			position: absolute;
			width: 240px;
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			transform-style: preserve-3d;
			transition: opacity 0.5s linear; 
			opacity: 1;
			pointer-events: none;
			// border: 2px solid red;
			.particle {
				transition: all 3s ease-in-out;
				// width: 10px;
				height: 10px;
				flex-basis: 3.8%;
				flex-grow: 1;
				background-color: #43627D;
				opacity: 1;
				will-change: opacity, transform;
			}
		}
		.nav-group {
			transform: translateY(10px);
			opacity: 0;
			height: 100%;
			width: 240px;
			background-color: #43627D;
			display:flex;
			flex-direction: column;
			transition: opacity 0.5s linear;
			color: white;
			position: absolute;
			margin: 0;
			li {
				line-height: 80px;
				flex-grow: 1;
				padding-left: 50px;
				transition: background-color 1s linear;
				&::before {
					content: '';
					position: absolute;
					width: 10px;
					height: 10px;
					background-color: transparent;
					border: 1px solid white;
					margin-top: 33px;
					left: 20px;
				}
				&:hover {
					background-color: #385269;
				}
			}
		}
	}
	
	.banner {
		$banner-height: 80px;
		height: $banner-height;
		background-color: $banner-color;
		position: relative;
		border-radius: $display-border-radius $display-border-radius 0 0;
		.hamburger-menu {
			$height: 25px;
			$width: 50px;
			$menu-color: #B2DAFF;
			$menu-color-hover: white;
			position: absolute;
			height: $height;
			width: $width;
			top: 50%;
			left: 25px;
			transform: translateY($height/-2);
			&:hover {
				div {
					background-color: $menu-color-hover;
					&:first-of-type::after {
						background-color: $menu-color-hover;
					}
				}
			}
			div {
				$dash-height: 5px;
				position: absolute;
				width: 100%;
				height: $dash-height;
				background-color: $menu-color;
				border-radius: $height/2;
				transition: background-color 0.2s linear;
				&:first-of-type {
					top: 2px;
					&::after {
						transition: background-color 0.2s linear;
						content: '';
						position: absolute;
						right: 0;
						width: $dash-height * 2;
						height: $dash-height * 2;
						transform: translateY(-25%);
						border-radius: $height;
						background-color: $menu-color;
						box-shadow: 0 0 0 5px $banner-color;
					}
				}
				&:last-of-type {
					bottom: 0;
				}
			}
		}
		h3 {
			color: white;
			text-align: center;
    	font-size: 19px;
			font-weight: 600;
			line-height: $banner-height;
		}
	}
	.content {
		position: relative;
		flex-grow: 1;
		background-color: white;
		border-radius: 0 0 $display-border-radius $display-border-radius;
		padding-right: 20px;
		&::before {
			content: '';
			position: absolute;
			width: 5px;
			height: 100%;
			background-color: gray;
			opacity: 0.4;
			left: 30px;
		}
		ol {
			display: flex;
			flex-wrap: wrap;
			height: 320px;
	    padding-top: 50px;
			padding-left: 50px;
		}
		li {
			margin-bottom: 25px;
			color: #666666;
			&:hover {
				color: #5F98CD;
			}
			&::before {
				content: '';
				position: absolute;
				width: 10px;
				height: 10px;
				background-color: white;
				box-shadow: 0 0 0 5px white;
				left: 26px;
				border: 2px solid #5F98CD;;
				border-radius: 50%;
			}
			span {
				font-size: 20px;
				line-height: 30px;
				
				&:first-of-type {
					margin: 5px;
					margin-top: -8px;
					display: block;
				}
				&:nth-of-type(2) {
					font-weight: bold;
				}
			}
		}
	}
}
</style>
