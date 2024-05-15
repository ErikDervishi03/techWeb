let studyTime = 0;
let breakTime = 0;
let cycles = 0;
let ready = false;
let onGoing = false;
let seconds = "00";

document.getElementById('studyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if(!onGoing) {
        studyTime = parseInt(document.getElementById('studyTime').value, 10);
        breakTime = parseInt(document.getElementById('breakTime').value, 10);
        cycles = parseInt(document.getElementById('cycles').value, 10);
        ready = true;
    }
    document.getElementById('minutes').innerHTML = studyTime;
    document.getElementById('seconds').innerHTML = seconds;
});

function start() {
    if(!onGoing && ready) {
        startTimer();
    }
}

function startTimer() {
    onGoing = true;
    // change button
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";
    document.getElementById('disp').innerHTML = "Study time!"
    
    let numOfCyclesDone = 0;

    // change the time
    seconds = 59;

    var counter = studyTime - 1;
    animateCircle((counter+1)*60000);

    // countdown
    let timerFunction = () => {
        //change the display
        document.getElementById('minutes').innerHTML = counter;
        document.getElementById('seconds').innerHTML = seconds;

        // start
        seconds = seconds - 1;

        if(seconds < 0) {
            counter = counter - 1;
            if(counter < 0) {
                numOfCyclesDone = numOfCyclesDone + 1;
                if(numOfCyclesDone % 2 != 0) {
                    counter = breakTime - 1;
                    document.getElementById('disp').innerHTML = "Break time!";
                }
                else {
                    counter = studyTime - 1;
                    document.getElementById('disp').innerHTML = "Study time!";
                }

                if(numOfCyclesDone < cycles*2) {
                    animateCircle( (counter+1)*60000 );
                }
            }
            seconds = 59;
        }
        
        if(numOfCyclesDone >= cycles*2) {
            clearInterval(timer);
            clearDisp();
        }
    }

    // start countdown
    var timer = setInterval(timerFunction, 1000); // 1000 = 1s
    
}

function clearDisp() {
    document.getElementById('disp').innerHTML = "END"
}

function animateCircle(time) {
	document.getElementById("circleTimer").animate([
			{ offsetDistance: '-25%' },
			{ offsetDistance: '75%' }
		], 
		{
			duration: time,
			easing: 'linear',
			iterations: 1,
			fill: 'forwards'
		}
	);
}