"""
==========================
Driven, damped oscillator.
==========================
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

omega0=3.2 # angular frequency of driving force
f0=1.     # amplitude of driving sinusoidal force
Q=20      # quality of oscillator
k=4.      # spring constant
m=1.   # mass of the oscillator
omega=np.sqrt(k/m)  # natural frequency of oscillator
omegat=omega/(2*Q)
omegap=omegat*np.sqrt(4*Q*Q-1)
prefactor=f0/(2*m*omegap)
sumd=omegat*omegat+(omega0+omegap)*(omega0+omegap)
diffd=omegat*omegat+(omega0-omegap)*(omega0-omegap)
x_offset=0.5  # equilibrium x position
int_ms=30 # interval between frames in ms

# create a time array sampled at steps of dt
dt=0.1
tmin=0
tmax=50
t=np.arange(tmin,tmax,dt)

# intermediate factors
cosbit=(omegat/sumd-omegat/diffd)*np.cos(omega0*t)
sinbit=((omega0+omegap)/sumd-(omega0-omegap)/diffd)*np.sin(omega0*t)
xs=prefactor*(cosbit+sinbit)
cosbit=(omegat/sumd-omegat/diffd)*np.cos(omegap*t)
sinbit=((omega0+omegap)/sumd+(omega0-omegap)/diffd)*np.sin(omegap*t)
xt=prefactor*(cosbit+sinbit)*np.exp(-omegat*t)

# determine the displacement as a function of time by
# summing up the weighted G(t-t_imp) contributions.
x=xs+xt
y=np.zeros(len(t))

x+=x_offset
f=f0*np.sin(omega0*t)

ani=[]
fig,ax1,ax2,ax3=canvas(1,3,6,12)

plt.sca(ax1)
xmin=np.amin(x)
xmax=np.amax(x)
xmin=xmin-0.05*(xmax-xmin)
plt.xlim(xmin,1.03*xmax)
plt.ylim(-0.1,0.1)
plt.axis('off')
line,=ax1.plot([],[],'b-',lw=2)
bob,=ax1.plot([],'bo',lw=2)
time_template='time = %.1fs'
time_text=ax1.text(0.05,0.1,'',transform=ax1.transAxes)

plt.sca(ax2)
fmin=np.amin(f)
fmax=np.amax(f)
plt.xlim(1.06*fmin,1.06*fmax)
plt.ylim(-0.1,0.1)
plt.axis('off')
label_template='Driving force'
label_text=ax2.text(0.05,0.1,'',transform=ax2.transAxes)
force,=ax2.plot([],[],'r-',lw=2)

plt.sca(ax3)
plt.xlim(tmin,tmax)
plt.ylim(1.1*xmin-x_offset,1.1*xmax-x_offset)
plt.xlabel('Time')
plt.ylabel('Displacement')
disp,=ax3.plot([],[],'b-',lw=1,label='Total')
steady,=ax3.plot([],[],'g-',lw=1,label='Steady state')
trans,=ax3.plot([],[],'m-',lw=1,label='Transient')
plt.legend(loc='best')
tt,dd,ss,tr=[],[],[],[]

def animate_all(i):
    modified=[] # List of objects in the plot that we've modified
    # Top panel
    thisx=[x[i],x[i]-100]
    thisy=[y[i],y[i]]
    line.set_data(thisx,thisy)
    bob.set_data(x[i],y[i])
    time_text.set_text(time_template % (i*dt))
    modified+=[line,bob,time_text]
    # Middle panel
    thisx=[0,f[i],0.92*f[i],f[i],0.92*f[i]]
    thisy=[y[i],y[i],y[i]+0.01,y[i],y[i]-0.01]
    force.set_data(thisx,thisy)
    label_text.set_text(label_template)
    modified+=[force,label_text]
    # Lower panel
    tt.append(t[i])
    dd.append(x[i]-x_offset)
    ss.append(xs[i])
    tr.append(xt[i])
    disp.set_data(tt,dd)
    steady.set_data(tt,ss)
    trans.set_data(tt,tr)
    modified+=[disp,steady,trans]
    return modified

ani=animation.FuncAnimation(fig,animate_all,range(1,len(t)),interval=int_ms,blit=True,repeat=False)

plt.show()

