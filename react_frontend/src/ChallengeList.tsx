import { Table } from "react-daisyui";
import { useNavigate } from "react-router-dom";

export default function ChallengeList() {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-screen w-full flex flex-col items-center">
        <h2>Feladatok</h2>
        <div className="max-w-1/2 text-center mt-10">
          <Table>
            <Table.Head>
              <span />
              <span>Név</span>
              <span>Leírás</span>
              <span>Összpontszám</span>
              <span>Feltöltötte</span>
              <span>Feltöltés ideje</span>
            </Table.Head>

            <Table.Body>
              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/1")}
              >
                <span>1</span>
                <span>Punched Cards</span>
                <span>Lyukkártyák szöveges generálása paraméterek alapján</span>
                <span>5</span>
                <span>Google</span>
                <span>2010-01-04 27:02:03</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/2")}
              >
                <span>2</span>
                <span>Stream</span>
                <span>Streamek streamelése videokártyába</span>
                <span>100</span>
                <span>JZ</span>
                <span>2014-14-14 14:14:14</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/3")}
              >
                <span>3</span>
                <span>Zárójelek</span>
                <span>Érvényes zárójelezés ellenőrzése</span>
                <span>3</span>
                <span>Prog1</span>
                <span>2020-20-20 20:20:20</span>
              </Table.Row>
              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/4")}
              >
                <span>4</span>
                <span>Bűvös négyzetek</span>
                <span>Bűvös négyzet megoldó készítése</span>
                <span>11</span>
                <span>Prog2</span>
                <span>2021-21-21 21:21:21</span>
              </Table.Row>
              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/5")}
              >
                <span>5</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/6")}
              >
                <span>6</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/7")}
              >
                <span>7</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/8")}
              >
                <span>8</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/9")}
              >
                <span>9</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/10")}
              >
                <span>10</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>

              <Table.Row
                hover
                className="cursor-pointer"
                onClick={() => navigate("/editor/11")}
              >
                <span>11</span>
                <span>Feladat2</span>
                <span>Még egy feladat</span>
                <span>12</span>
                <span>Prog3</span>
                <span>2023-23-23 23:23:23</span>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
