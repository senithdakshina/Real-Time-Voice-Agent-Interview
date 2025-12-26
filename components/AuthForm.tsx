"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { email, z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./formfeild";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth/cordova";
import { auth } from "@/firebase/client";
import { signIn, SignUp } from "@/lib/actions/auth.action ";
import { signInWithEmailAndPassword } from "firebase/auth";


const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {

  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // console.log("SignUp ", values);
        const {name, email , password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)

        const result = await SignUp({
          uid :userCredentials.user.uid,
          name : name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        toast.success('Account Created successfully.Please sign in!');
        router.push('/sign-in')
      } else {
        const{email , password} = values;
        const userCredentials =  await signInWithEmailAndPassword(auth,email,password);
        const idToken = await userCredentials.user.getIdToken();
        if(!idToken){
          toast.error("Sign in faild!!")
          return;
        }
        await signIn({
          email,idToken
        })

        toast.success('successfully login!');
        router.push('/')
        // console.log("signIn", values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There is an error :${error}`);
    }
    console.log(values);
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10  items-center">
          <div className="flex flex-row gap-2 justify-center ">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">VocaAI</h2>
          </div>
          <h3>Practice job interview with AI</h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-4 form"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Username "
                  placeholder="Your Name"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email "
                placeholder="Your Email"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password "
                placeholder="Your Password"
                type="password"
              />

              <Button className="btn" type="submit">
                {isSignIn ? "sign in" : "create an acccount"}
              </Button>
            </form>
          </Form>
          <p className="text-center">
            {isSignIn ? "No Account yet?" : "Have an Account already"}
            <Link
              href={!isSignIn ? "/sign_in" : "/sign_up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
