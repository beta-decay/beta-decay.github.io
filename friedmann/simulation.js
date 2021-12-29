// A program to simulate the expansion of the universe using the Friedmann Equation
// Written by Beta Decay

function startSimulation(rad, mass, vac, hubble) {    
    var R = rad;
    var M = mass;
    var L = vac;
    var H0 = hubble
    
    var omega = R + M + L;
 
    var K = 1 - omega;
    
    // limits: 0.0 <= t <= 26.0
    var a = 0.0
    var b = 26.0

    // steps
    var N = Math.floor(7e4)

    // step-size
    var h = (b-a)/N

    // initial value: a(0.001) = 0.001
    var IV = [0.001,0.001]

    // make arrays to hold t, and y
    var ts = []
    var w = []
    var fs = []

    // set the initial values
    while (a < b+h) {
        a += h;
        ts.push(a);
    }
    //ts = np.arange(a, b+h, h).tolist()
    
    
    w.push(IV[1])

    var complex_value = false
    var max_i = 0
    var exit_loop = false
    
    var f, y, t

    // apply Euler's method
    for (var i=1; i<N+1; i++){
        if (!exit_loop){
            
            y = w[i-1]
            t = ts[i-1]
            
            if (!complex_value){
                f = H0 * Math.sqrt(M * y**-1 + R * y**-2 + L * y**2 + K)
                
                //console.log(f);
                
                if (M * y**-1 + R * y**-2 + L * y**2 + K <= 0) {
                    console.log("Complex value: ", M * y**-1 + R * y**-2 + L * y**2 + K);
                    //raise ValueError(e)
                    //plotGraph()
                    complex_value = true;
                    max_i = i

                    f = -1*fs[max_i-2]
                }
            } else {
                if (max_i-(i-max_i) >= 0) {
                    f = -1*fs[max_i-(i-max_i)]
                } else {
                    ts = ts.slice(0,i);
                    exit_loop = true;
                }
            }
        

            if (!exit_loop){    
                fs.push(f)

                maxi = i
                w.push(w[i-1] + h * f)
            }
        }
    }
    
    //console.log(a_data);

    var line = {
      x: ts,
      y: w,
      type: 'scatter'
    };
    
    var layout = {
      title: 'Expansion of the Universe',
      xaxis: {
        title: 'Time, t /Gyrs',
        titlefont: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
      yaxis: {
        title: 'Scale Factor, a',
        titlefont: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
      width: 800,
      height: 800
    };
    
	var ctx = document.getElementById("myChart");
    
	Plotly.newPlot(ctx, [line], layout);
}