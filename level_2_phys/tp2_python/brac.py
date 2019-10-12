import pylab as P
import numpy as N
from scipy.optimize import fsolve
xb=1.; yb=-1.; r=xb/yb

def trig(theta1):
    if (N.abs(theta1)<0.0001):
        trig=0.
    else:
        trig=(theta1-N.sin(theta1))/(1-N.cos(theta1))-r
    return trig

def fillarray():
    theta1=fsolve(trig,1.1)
    biga=2*yb/(1-N.cos(theta1))
    print xb,yb,r,theta1,trig(theta1),biga
    th=N.arange(0,theta1,theta1/1000,dtype='float')
    xout=(biga/2)*(th-N.sin(th))
    yout=(biga/2)*(1-N.cos(th))
    return xout,yout
    
xb=1.; yb=-1.; r=xb/yb
x,y=fillarray()
xb=0.5; yb=-0.5; r=xb/yb
x2,y2=fillarray()
xb=0.3; yb=-0.9; r=xb/yb
x3,y3=fillarray()
xb=0.9; yb=-0.3; r=xb/yb
x4,y4=fillarray()
xb=0.9; yb=-0.1; r=xb/yb
x5,y5=fillarray()
P.plot(x,y)
P.plot(x2,y2)
P.plot(x3,y3)
P.plot(x4,y4)
P.plot(x5,y5)
P.show()
