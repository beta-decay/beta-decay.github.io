"""
===========================
Central force example
===========================
"""
from numpy import sin, cos
import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation

R_out=1.  # outer radius
R_out2=R_out*R_out
R_in=0.3  # inner radius

def newv(x,y,vx,vy):
    sep2=x*x+y*y
    if sep2>=R_out2:
        a11=x*x-y*y
        a21=2*x*y
        a12=a21
        a22=-a11
        newvx=-(a11*vx+a21*vy)/sep2
        newvy=-(a12*vx+a22*vy)/sep2
    else:
        newvx=vx
        newvy=vy

    return newvx,newvy

# create a time array up to t_max sampled at steps of dt
dt=0.01
t_max=20.
t=np.arange(0,t_max,dt)

# set the initial conditions in Cartesian coordinates
x=np.zeros(len(t))
y=np.zeros(len(t))
x[0]=R_in
y[0]=0.
vx=0.
vy=1.

# do the integration in time.
for i in range(len(t)-1):
    x[i+1]=x[i]+vx*dt
    y[i+1]=y[i]+vy*dt
    oldvx=vx
    oldvy=vy
    vx,vy=newv(x[i+1],y[i+1],oldvx,oldvy)

fig=plt.figure()
ax=fig.add_subplot(111,autoscale_on=False,xlim=(-1.1*R_out,1.1*R_out),ylim=(-1.1*R_out,1.1*R_out))
ax.set_aspect('equal')

mass,=ax.plot([],[],'bo',lw=2,ms=3)
trail,=ax.plot([],[],'b-',lw=1)

xx,yy=[],[]
def animate(i):
    mass.set_data(x[i],y[i])
    xx.append(x[i])
    yy.append(y[i])
    trail.set_data(xx,yy)
    return mass,trail

theta=np.arange(0,2*np.pi,0.001)
xout=R_out*np.cos(theta)
yout=R_out*np.sin(theta)
xin=R_in*np.cos(theta)
yin=R_in*np.sin(theta)
plt.plot(xout,yout,'black')
plt.plot(xin,yin,'black')
plt.axis('off')
ani=animation.FuncAnimation(fig,animate,range(1,len(t)),interval=10,blit=True,repeat=False)
plt.show()
