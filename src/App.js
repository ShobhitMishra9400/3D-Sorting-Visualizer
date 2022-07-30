import React, { Component } from 'react';
import Helmet from "react-helmet";

// Algorithms
import BubbleSort from './algorithms/BS';
import InsertionSort from './algorithms/IS';
import SelectionSort from './algorithms/Selection';

// Icons
import Play from '@material-ui/icons/PlayCircleOutlineRounded';
import Forward from '@material-ui/icons/SkipNextRounded';
import Backward from '@material-ui/icons/SkipPreviousRounded';
import RotateLeft from '@material-ui/icons/RotateLeft';

import Bar from './components/Bar';
import Form from './components/Form';
//CSS
import './App.css';

class App extends Component {
	state = {
		array: [],
		arraySteps: [],
		colorKey: [],
		colorSteps: [],
		currentStep: 0,
		count: 8,
		delay: 250,
		algorithm: 'Insertion Sort',
		timeouts: [],
	};

	ALGORITHMS = {
		'Bubble Sort': BubbleSort,
		'Insertion Sort': InsertionSort,
		'Selection Sort': SelectionSort,
	};

	componentDidMount() {
		this.generateRandomArray();
	}

	generateSteps = () => {
		let array = this.state.array.slice();
		let steps = this.state.arraySteps.slice();
		let colorSteps = this.state.colorSteps.slice();

		this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

		this.setState({
			arraySteps: steps,
			colorSteps: colorSteps,
		});
	};

	clearTimeouts = () => {
		this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
		this.setState({
			timeouts: [],
		});
	};

	clearColorKey = () => {
		let blankKey = new Array(this.state.count).fill(0);

		this.setState({
			colorKey: blankKey,
			colorSteps: [blankKey],
		});
	};

	generateRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	};

	generateRandomArray = () => {
		this.clearTimeouts();
		this.clearColorKey();
		const count = this.state.count;
		const temp = [];

		for (let i = 0; i < count; i++) {
			temp.push(this.generateRandomNumber(50, 200));
		}

		this.setState(
			{
				array: temp,
				arraySteps: [temp],
				currentStep: 0,
			},
			() => {
				this.generateSteps();
			}
		);
	};

	changeArray = (index, value) => {
		let arr = this.state.array;
		arr[index] = value;
		this.setState(
			{
				array: arr,
				arraySteps: [arr],
				currentStep: 0,
			},
			() => {
				this.generateSteps();
			}
		);
	};


	previousStep = () => {
		let currentStep = this.state.currentStep;
		if (currentStep === 0) return;
		currentStep -= 1;
		this.setState({
			currentStep: currentStep,
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
		});
	};

	nextStep = () => {
		let currentStep = this.state.currentStep;
		if (currentStep >= this.state.arraySteps.length - 1) return;
		currentStep += 1;
		this.setState({
			currentStep: currentStep,
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
		});
	};

	start = () => {
		let steps = this.state.arraySteps;
		let colorSteps = this.state.colorSteps;

		this.clearTimeouts();

		let timeouts = [];
		let i = 0;

		while (i < steps.length - this.state.currentStep) {
			let timeout = setTimeout(() => {
				let currentStep = this.state.currentStep;
				this.setState({
					array: steps[currentStep],
					colorKey: colorSteps[currentStep],
					currentStep: currentStep + 1,
				});
				timeouts.push(timeout);
			}, this.state.delay * i);
			i++;
		}

		this.setState({
			timeouts: timeouts,
		});
	};

	increaseQuantity = () => {
		if (20 <= this.state.count) return;
	
		let qty = this.state.count;
		qty +=1;
		console.log(this.state);
		this.setState({
			count: qty
		},
		() => {
			this.generateSteps();
		}
		);
		
		this.generateRandomArray();
		this.clearColorKey();
		console.log(this.state);
		
	  };
	
	decreaseQuantity = () => {
		if (1 >= this.state.count) return;

		let qty = this.state.count;
		qty -=1;
		this.setState({
			count: qty
		},
		() => {
			this.generateSteps();
		}
		);
		
		this.generateRandomArray();
		this.clearColorKey();
		
	  };

	  changeSort = (e) => {
		this.clearTimeouts();
		this.setState({
			algorithm: (e.target.value),
		})
	}

	changeSpeed = (e) => {
		this.clearTimeouts();
		this.setState({
			delay: parseInt(e.target.value),
		})
	}

	render() {
		let bars = this.state.array.map((value, index) => (
			<Bar
				key={index}
				index={index}
				length={value}
				color={this.state.colorKey[index]}
				changeArray={this.changeArray}
			/>
		));

		let playButton;
		
		

		if (this.state.arraySteps.length === this.state.currentStep) {
			playButton = (
				<button className='controller' onClick={this.generateRandomArray}>
					<RotateLeft />
				</button>
			);
		} else {
			playButton = (
				<button className='controller' onClick={this.start}>
					<Play />
				</button>
			);
		}

		return (
			
			<div className='app'>
				<Helmet>
				<title>SV App</title>
				</Helmet>
				<div className='heading'>
					<h1>3D SORTING VISUALIZER</h1>
				</div>
				<div className='frame'>
					<div className='barsDiv container card'>{bars}</div>
				</div>
				<div className='control-pannel'>
					<div className='control-buttons'>
						

						<button className='controller' onClick={this.previousStep}>
							<Backward />
						</button>
						{playButton}
						<button className='controller' onClick={this.nextStep}>
							<Forward />
						</button>
						<div className = 'Input'>
								<div className='I1'>
									<h2> Array size </h2>
								</div>	
								
							<div className='I2'>
								<button onClick={this.decreaseQuantity} >-</button>
								<input readOnly type="number" value={this.state.count} />
								<button onClick={this.increaseQuantity}>+</button>
							</div>
					
						</div>
					</div>
					
				</div>
				
				<div className='functions'>
					<div className='pannel'>
						<Form
							formLabel='Sort Technique'
							values={["Bubble Sort", "Insertion Sort","Selection Sort"]}
							currentValue={this.state.algorithm}
							lables={['Bubble Sort', 'Insertion Sort', 'Selection Sort']}
							onChange={this.changeSort}
						/>
					</div>

					<div className='pannel'>
					<Form
						formLabel='Speed'
						values={[500,300,100]}
						currentValue={this.state.delay}
						lables={['1x', '2x', '3x']}
						onChange={this.changeSpeed}
					/>
					</div>

				</div>
				<div className='footer'>
					<p> &#169; Shobhit Mishra</p>
				</div>
			</div>
		);
	}
}

export default App;
