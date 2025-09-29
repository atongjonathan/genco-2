import { useAuth } from '@/auth'
import { findUser } from '@/firebase/data'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      loginMutation.mutate(values.value)
    }
  })

  const { signIn } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      await signIn(values.email, values.password);
    },
    onSuccess: async () => {
      const user = await findUser(form.getFieldValue('email'));
      console.log(user);
    }, 
    onError: (error) => {
      alert('Login failed: ' + (error as Error).message);
    }
  })

  return (
    <div className='h-screen flex items-center'>
      <div className="login-box mx-auto my-auto min-w-max">
        <div className="login-logo flex justify-center items-center gap-3">
          <a href="/"> <img
          src={'/logo%20copy.png'}
          className="h-[10vmin] pointer-events-none"
          alt="logo"
        /></a>
        <b className='text-xl'>Savanna Herds Limited</b>
      </div>
      <div className="card card-outline card-primary">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form  onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
            <div className="input-group mb-3">
               <form.Field
                name="email"
                children={(field) => <input 
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}

                type="email" className="form-control" placeholder="Email" />}
              />
              
              <div className="input-group-text"><span className="bi bi-envelope"></span></div>
            </div>
            <div className="input-group mb-3">
              <form.Field
                name="password"
                children={(field) => <input type="password" value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)} className="form-control" placeholder="Password" />}
              />
              <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
            </div>

            <div className="row">
              <div className="col-8">
                <div className="form-check">
                  <input title='Remember Me' className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                  <label className="form-check-label" > Remember Me </label>
                </div>
              </div>
              <div className="col-4">
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Sign In</button>
                </div>
              </div>
            </div>

          </form>
          
        </div>

      </div>
  </div>
   </div>
  )
}
