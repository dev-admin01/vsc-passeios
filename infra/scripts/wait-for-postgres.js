const { exec } = require("child_process");

function checkPostgres() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      // eslint-disable-next-line no-undef
      console.log(stdout);
      if (stdout.includes("accepting connections")) {
        // eslint-disable-next-line no-undef
        console.log("\n🟢 Postgres está pronto e aceitando conexões!\n");
      } else {
        // eslint-disable-next-line no-undef
        process.stdout.write(".");
        // eslint-disable-next-line no-undef
        setTimeout(checkPostgres, 2000);
      }
    },
  );
}
// eslint-disable-next-line no-undef
console.log("\n🔴 Aguardando Postgres aceitar conexões...");
checkPostgres();
