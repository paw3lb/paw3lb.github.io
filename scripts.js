let clicks = 0
let clickPower = 1

if (localStorage.getItem("clicks")) {
    clicks = parseFloat(localStorage.getItem("clicks"));
    document.getElementById("currency").innerHTML = clicks.toFixed(1);
}

function score() {
    clicks = clicks + clickPower;
    let niepowienm = clicks.toFixed(1);
    document.getElementById("currency").innerHTML = niepowienm;

    localStorage.setItem("clicks", clicks);
}

async function leaderboard() {
    const nickname = document.getElementById("nickname").value.trim();
    if (!nickname) {
        alert("wpisz cos cwelu")
        return;
    }

    const score = parseFloat(clicks.toFixed(1));

      try {
        await db.collection("leaderboard").doc(nickname).set({ score });
        alert("Wynik zapisany!");
        showLeaderboard(); // odśwież ranking
        } catch (error) {
            console.error("Błąd przy zapisie:", error);
        }
    }

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

   // leaderboard.sort((a, b) => b.score - a.score)
   // localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    //showLeaderboard(); 

// Dodaj wynik użytkownika
    const existing = leaderboard.find(entry => entry.nick === nickname);
    if (existing) {
        if (score > existing.score) {
            existing.score = score;
        }
    } else {
        leaderboard.push({ nick: nickname, score: score });
    }

    leaderboard.sort((a, b) => b.score - a.score);

// Zapis
//    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    

// Wyświetl leaderboard
async function showLeaderboard() {
    const list = document.getElementById("lista");
    list.innerHTML = "";

    try {
        const snapshot = await db.collection("leaderboard")
        .orderBy("score", "desc")
        .limit(10)
        .get();
        
        snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${doc.id} — ${data.score}`;
        list.appendChild(li);
        });
    } catch (error) {
        console.error("Błąd przy pobieraniu wyników:", error);
    }
}   
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

//    leaderboard.forEach(entry => {
//        const li = document.createElement("li");
//        li.textContent = `${entry.nick} — ${entry.score}`;
//        list.appendChild(li);
//    });
//}

// Pokaż leaderboard przy starcie
window.onload = function () {
    showLeaderboard();
};
