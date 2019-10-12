"""
==========================================
Green's functions for undamped oscillator.
==========================================
"""
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation

def canvas(nx,ny,sizex,sizey):
    """Define the overall canvas area and subplot areas"""
    fig=plt.figure(figsize=(sizex,sizey))
    gs=mpl.gridspec.GridSpec(ny,nx)
    ax1=plt.subplot(gs[0,0])
    ax2=plt.subplot(gs[1,0])
    ax3=plt.subplot(gs[2,0])
    return fig,ax1,ax2,ax3
    
omega=2  # angular frequency of oscillator
mass=1   # mass of the oscillator
int_ms=30 # interval between frames in ms

# create a time array sampled at steps of dt
dt=0.1
tmin=0
tmax=50
t=np.arange(tmin,tmax,dt)

# set the times and amplitudes of the impulsive forces
f_imp=[1,0.5]
t_imp=[10,30]

# determine the displacement as a function of time by
# summing up the weighted G(t-t_imp) contributions
x=np.zeros(len(t))
y=np.zeros(len(t))
f=np.zeros(len(t))
for i in range(len(f_imp)):
    x=np.where(t>t_imp[i],x+(f_imp[i]/mass)*np.sin(omega*(t-t_imp[i])),x)
    f=np.where(t==t_imp[i],f+f_imp[i],f)

ani=[]
fig,ax1,ax2,ax3=canvas(1,3,6,12)

plt.sca(ax1)
xmin=np.amin(x)
xmax=np.amax(x)
plt.xlim(1.1*xmin,1.1*xmax)
plt.ylim(-0.1,0.1)
plt.xlabel('Displacement')
plt.axis('off')
line,=ax1.plot([],[],'o-',lw=2)
time_template='Time = %.1fs'
time_text=ax1.text(0.05,0.1,'',transform=ax1.transAxes)

plt.sca(ax2)
fmin=np.amin(f)
fmax=np.amax(f)
fmin=fmin-0.1*(fmax-fmin)
plt.xlim(tmin,tmax)
plt.ylim(fmin,1.1*fmax)
plt.xlabel('Time')
plt.ylabel('Force')
force,=ax2.plot([],[],'r-')
tt,ff=[],[]

plt.sca(ax3)
dmin=np.amin(x)
dmax=np.amax(x)
plt.xlim(tmin,tmax)
plt.ylim(1.1*dmin,1.1*dmax)
plt.xlabel('Time')
plt.ylabel('Displacement')
disp,=ax3.plot([],[],'b-')
tt2,dd=[],[]

def animate_all(i):
    modified=[] # List of objects in the plot that we've modified
    # Top panel
    thisx=[x[i],x[i]-5]
    thisy=[y[i],y[i]]
    line.set_data(thisx,thisy)
    time_text.set_text(time_template % (i*dt))
    modified+=[line,time_text]
    # Middle panel
    tt.append(t[i])
    ff.append(f[i])
    force.set_data(tt,ff)
    modified+=[force,]
    # Lower panel
    tt2.append(t[i])
    dd.append(x[i])
    disp.set_data(tt2,dd)
    modified+=[disp,]
    return modified

ani=animation.FuncAnimation(fig,animate_all,range(1,len(t)),interval=int_ms,blit=True,repeat=False)

plt.show()
