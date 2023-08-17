'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { useState } from "react";


export default function NavBar() { 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        "Home",
        "Blog"
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <img src="/caye-pc.png" width='50px' alt="logo" />
										<p className="font-bold text-inherit">Caye&apos;s Portfolio</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-5" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item}-${index}`}>
                        <Link color="foreground" href="#">
                            {item}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                        className="w-full"
                        color={
                            index === 2 ? "warning" : "foreground"
                        }
                        href="#"
                        size="lg"
                    >
                        {item}
                    </Link>
                </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
