import { Table } from "react-daisyui";

export default function Highscores() {
	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Legjobb eredmények</h2>
				<div className="w-1/2 text-center mt-10">
					<Table>
						<Table.Head>
							<span />
							<span>Név</span>
							<span>Pontszámok</span>
							<span>Eltelt idő</span>
							<span>Futásidő</span>
							<span>Memóriahasználat</span>
						</Table.Head>

						<Table.Body>
							<Table.Row hover className="cursor-pointer">
								<span>1</span>
								<span>Egyik felhasználó</span>
								<span>5/5/5</span>
								<span>5:13</span>
								<span>7 ms</span>
								<span>2.1 MB</span>
							</Table.Row>

							<Table.Row hover className="cursor-pointer">
								<span>2</span>
								<span>Másik felhasználó</span>
								<span>5/5/4</span>
								<span>6:11</span>
								<span>9 ms</span>
								<span>2.33 MB</span>
							</Table.Row>

							<Table.Row hover className="cursor-pointer">
								<span>3</span>
								<span>Harmadik felhasználó</span>
								<span>5/5/3</span>
								<span>7:30</span>
								<span>11 ms</span>
								<span>2.9MB </span>
							</Table.Row>
							<Table.Row hover className="cursor-pointer">
								<span>4</span>
								<span>Negyedik felhasználó</span>
								<span>5/4/3</span>
								<span>17:40</span>
								<span>15 ms</span>
								<span>2.91 MB</span>
							</Table.Row>
							<Table.Row hover className="cursor-pointer">
								<span>5</span>
								<span>Ötödik felhasználó</span>
								<span>5/3/3</span>
								<span>1:11:21</span>
								<span>19 ms</span>
								<span>4 MB</span>
							</Table.Row>

							<Table.Row hover className="cursor-pointer">
								<span>6</span>
								<span>Hatodik felhasználó</span>
								<span>4/3/3</span>
								<span>2:30:06</span>
								<span>20 ms</span>
								<span>3.91 MB</span>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
