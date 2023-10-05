import { DotsThree, List } from "@phosphor-icons/react";
import { Button, Navbar } from "react-daisyui";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar className="fixed">
        <div className="flex-none">
          <Button shape="square" color="ghost">
            <List size={24} />
          </Button>
        </div>
        <div className="flex-1">
          <Button
            tag="a"
            color="ghost"
            className="normal-case text-xl"
            onClick={() => navigate("/")}
          >
            codeHUB
          </Button>
        </div>
        <div className="flex-none gap-2">
          <Button color="primary" onClick={() => navigate("/upload")}>
            Új feladat feltöltése
          </Button>
          <Button color="primary">BEJELENTKEZÉS</Button>
          <Button shape="square" color="ghost">
            <DotsThree size={24} />
          </Button>
        </div>
      </Navbar>
    </>
  );
}
