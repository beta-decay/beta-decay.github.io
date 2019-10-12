import numpy as np
import matplotlib.pyplot as plt

def damped(x0,xdot0,Q,omega,t):
    if Q<0.5:
        omegap=(0.5*omega/Q)*np.sqrt(1-4*Q*Q)
        y=omegap*t
        x=np.exp(-0.5*omega*t/Q)
        B=(xdot0+0.5*omega*x0/Q)/omegap
        x=x*(x0*np.cosh(y)+B*np.sinh(y))
    elif Q>0.5:
        omegap=(0.5*omega/Q)*np.sqrt(4*Q*Q-1)
        y=omegap*t
        x=np.exp(-0.5*omega*t/Q)
        B=(xdot0+0.5*omega*x0/Q)/omegap
        x=x*(x0*np.cos(y)+B*np.sin(y))
    else:
        x=np.exp(-0.5*omega*t/Q)
        B=xdot0+0.5*omega*x0/Q
        x=x*(x0+B*t)
    return x
    
omega=1.
t=np.arange(0.,5*(2*np.pi/omega),0.01,dtype='float')
Q=.5;x0=1.;xdot0=0.
x=damped(x0,xdot0,Q,omega,t)
plt.plot(t,x,'black',lw=2,label=r"Q=%.1f; $x_0=%.1f$; $\dot{x}_0=%.1f$"%(Q,x0,xdot0))
x0=0.;xdot0=1.
x2=damped(x0,xdot0,Q,omega,t)
plt.plot(t,x2,'red',lw=2,label=r"Q=%.1f; $x_0=%.1f$; $\dot{x}_0=%.1f$"%(Q,x0,xdot0))
plt.legend(loc='best')
plt.xlabel('time/s')
plt.ylabel('x(t)')
plt.show()
