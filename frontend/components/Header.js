import React, { useState } from "react";
import { Button, Container, Menu, Image } from "semantic-ui-react";
import Link from "next/link";

export default function Header() {
  const [active, setActive] = useState("Marketplace");

  const handleNavItemClick = (e, { name }) => setActive(name);
  return (
    <Menu borderless fixed="top">
      <Container>
        <Image src="/logo.png" floated="left" size="small" className="logo" />
        <Menu.Menu position="right">
          <Link href="/">
            <Menu.Item name="Marketplace" active={active === "Marketplace"}>
              Marketplace
            </Menu.Item>
          </Link>
          <Menu.Item
            name="Account"
            active={active === "Account"}
            onClick={handleNavItemClick}
          >
            Account
          </Menu.Item>
          <Menu.Item name="upcomingEvents">
            <Link href="/new">
              <Button primary>Create NFT</Button>
            </Link>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
