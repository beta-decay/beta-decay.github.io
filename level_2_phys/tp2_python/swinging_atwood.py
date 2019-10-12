"""
===========================
The swinging Atwood machine
===========================
"""
import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation

G=1  # acceleration due to gravity
M1=1.0  # mass of pendulum 1
mrat=2.397  # relative mass of pendulum 2 (2,2.397)
M2=mrat*M1
# theta is the initial angle, r is the initial pulley distance
r=0.3
r_dot=0.
theta=90.0*np.pi/180.  # 80,70,90
theta_dot=0.

def derivs(state, t):
    dvecdt=np.zeros_like(state)
    dvecdt[0]=state[1]
    dvecdt[1]=(M1*state[0]*state[3]*state[3]-G*(mrat-M1*np.cos(state[2])))/(M1+mrat)
    dvecdt[2]=state[3]
    if state[0]>0:
        dvecdt[3]=-(G*np.sin(state[2])+2*state[1]*state[3])/state[0]
    else:
        dvecdt[3]=0

    return dvecdt

# create a time array from 0..100 sampled at steps of dt
dt=0.01
t=np.arange(0,20,dt)

# initial state
state=[r,r_dot,theta,theta_dot]

# integrate your ODE using scipy.integrate.
vec = integrate.odeint(derivs, state, t)

# set pulley positions and rope length
px1=-0.25
py1=0.
px2=0.25
py2=0.
l=0.8

x1=px1+vec[:,0]*np.sin(vec[:,2])
y1=py1-vec[:,0]*np.cos(vec[:,2])

x2=px2+x1-x1
y2=py2-l+vec[:,0]

xmin=1.1*np.amin(x1)
xmax=1.2*np.amax(x2)
ymin=1.1*np.amin(y2)
ymax=1.2*np.amax(y1)
fig=plt.figure()
ax=fig.add_subplot(111,autoscale_on=False,xlim=(xmin,xmax),ylim=(ymin,ymax))
ax.set_aspect('equal')

line,=ax.plot([],[],'-',color='black',lw=2)
trail,=ax.plot([],[],'b-',lw=1)
bob1,=ax.plot([],[],'bo',ms=4)
bob2,=ax.plot([],[],'bo',ms=4*mrat)
xx,yy=[],[]

def animate(i):
    thisx=[x1[i],px1,px2,x2[i]]
    thisy=[y1[i],py1,py2,y2[i]]
    line.set_data(thisx,thisy)
    xx.append(x1[i])
    yy.append(y1[i])
    trail.set_data(xx,yy)
    bob1.set_data(x1[i],y1[i])
    bob2.set_data(x2[i],y2[i])
    return line,trail,bob1,bob2

plt.axis('off')
ani=animation.FuncAnimation(fig,animate,range(1,len(t)),interval=20,blit=True,repeat=False)

plt.show()
