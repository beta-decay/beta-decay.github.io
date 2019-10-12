"""
============================================
Linear oscillations of a triatomic molecule.
============================================
"""

import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation

M=1.    # mass of central atom
m=0.75  # mass of outer atoms
k=1.    # spring constant
l=0.35  # unstretched bond length
amp1=0.05 # amplitude of normal mode 1 (SMALL oscillations, 0.05)
amp2=0.03 # amplitude of normal mode 2 (SMALL oscillations, 0.03)
omega1=np.sqrt(k/m) # angular frequency of mode 1
omega2=omega1*np.sqrt(1+2*m/M) # angular frequency of mode 2

# create a time array up to t_max sampled at steps of dt
dt=0.01*2*np.pi/omega2
t_max=5*2*np.pi/omega1
t=np.arange(0,t_max,dt)

# set the initial conditions in Cartesian coordinates
x1=np.zeros(len(t))
x2=np.zeros(len(t))
x3=np.zeros(len(t))
y=np.zeros(len(t))
x2_0=0.
x1_0=x2_0-l
x3_0=x2_0+l

amplify=4
x1=x1_0-amp1*np.cos(omega1*t)+amp2*np.cos(omega2*t)
x2=x2_0-amp2*(2*m/M)*np.cos(omega2*t)
x3=x3_0+amp1*np.cos(omega1*t)+amp2*np.cos(omega2*t)
xmode1=x2_0+amplify*0.5*((x3-x3_0)-(x1-x1_0))
xmode2=x2_0+amplify*((x1-x1_0)-(2*m/M)*(x2-x2_0)+(x3-x3_0))/3
ymode1=y+0.2
ymode2=y-0.2

xmin=np.amin(x1)
xmax=np.amax(x3)
fig=plt.figure()
ax=fig.add_subplot(111, autoscale_on=False, xlim=(xmin-0.1,xmax+0.1), ylim=(-1,1))

line,=ax.plot([],[],'ko-',lw=2,ms=8)
atom2,=ax.plot([],[],'ko',ms=8*M/m)
mode1,=ax.plot([],[],'o',color=(0,1,0),ms=15)
mode2,=ax.plot([],[],'o',color=(0.9,0.6,0),ms=15)
#mode2,=ax.plot([],[],'o',color='orange',ms=15)

def animate(i):
    thisx=[x1[i],x3[i]]
    thisy=[y[i],y[i]]
    line.set_data(thisx,thisy)
    atom2.set_data(x2[i],y[i])
    mode1.set_data(xmode1[i],ymode1[i])
    mode2.set_data(xmode2[i],ymode2[i])
    return line,atom2,mode1,mode2

plt.axis('off')
ani=animation.FuncAnimation(fig,animate,range(1,len(t)),interval=30,blit=True)
plt.show()
