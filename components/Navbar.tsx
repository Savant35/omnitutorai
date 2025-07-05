import Link from "next/link"
import Image from "next/image"
import NavItems from "./NavItems"
import { SignInButton,SignedOut,UserButton, SignedIn } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"

const Navbar = () => {
  return (
    <nav className="navbar">
        <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer ">
            <Image
                src="images/logo.svg"
                alt="logo"
                width={140}
                height={60}
                className="dark:invert"
                />
        </div>
        </Link>
        <div className="flex items-center gap-8">
            <NavItems />
            <ModeToggle />
            <SignedOut>
                <SignInButton >
                  <button className="btn-signin">Sign In</button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
    </nav>
  )
}
export default Navbar