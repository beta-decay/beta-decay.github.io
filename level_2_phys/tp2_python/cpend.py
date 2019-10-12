"""
==============================
Coupled pendulum oscillations.
==============================
"""

from numpy import sin, cos
import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation

l_pend=0.98  # pendulum length
eta=1.  # coupling strength
amp1=0.1 # amplitude of normal mode 1 (SMALL oscillations)
amp2=0.1 # amplitude of normal mode 2 (SMALL oscillations)
omega1=1. # angular frequency of mode 1
omega2=omega1*np.sqrt(1+2*eta) # angular frequency of mode 2

# create a time array up to t_max sampled at steps of dt
dt=0.01*2*np.pi/omega2
t_max=5*2*np.pi/omega1
t=np.arange(0,t_max,dt)

# set the initial conditions in Cartesian coordinates
x1=np.zeros(len(t))
x2=np.zeros(len(t))
y1=np.zeros(len(t))
y2=np.zeros(len(t))
x_pivot1=np.zeros(len(t))
x_pivot2=np.zeros(len(t))
y_pivot1=np.zeros(len(t))
y_pivot2=np.zeros(len(t))
x_pivot1+=0.3
x_pivot2+=0.7
y_pivot1+=1.
y_pivot2+=1.

x1=x_pivot1+l_pend*(sin(amp1*cos(omega1*t))+sin(amp2*cos(omega2*t)))
y1=2*y_pivot1-l_pend*(cos(amp1*cos(omega1*t))+cos(amp2*cos(omega2*t)))
x2=x_pivot2+l_pend*(sin(amp1*cos(omega1*t))+sin(-amp2*cos(omega2*t)))
y2=2*y_pivot2-l_pend*(cos(amp1*cos(omega1*t))+cos(-amp2*cos(omega2*t)))
xmean=0.5*(x1+x2)
xdiff=0.5*(x_pivot1+x_pivot2)+(x2-x1)-(x_pivot2-x_pivot1)
ymean=y_pivot1-l_pend+0.08
ydiff=y_pivot1-l_pend-0.08

fig=plt.figure()
ax=fig.add_subplot(111,autoscale_on=False,xlim=(0,1),ylim=(-0.1,1.1))
#ax.set_aspect('equal')

line,=ax.plot([],[],'k-',lw=2)
bobs,=ax.plot([],[],'ko',lw=2,ms=10)
mean,=ax.plot([],[],'bo',ms=12)
diff,=ax.plot([],[],'ro',ms=12)

def animate(i):
    thisx=[x1[i],x_pivot1[i],x_pivot2[i],x2[i]]
    thisy=[y1[i],y_pivot1[i],y_pivot2[i],y2[i]]
    line.set_data(thisx, thisy)
    bobsx=[x1[i],x2[i]]
    bobsy=[y1[i],y2[i]]
    bobs.set_data(bobsx,bobsy)
    mean.set_data(xmean[i],ymean[i])
    diff.set_data(xdiff[i],ydiff[i])
    return line,bobs,mean,diff

plt.axis('off')
ani=animation.FuncAnimation(fig,animate,range(1,len(t)),interval=30, blit=True)
plt.show()
