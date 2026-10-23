// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6Sg3kKU8csaI5VChbJwS-dAGyAwkXK7M",
  authDomain: "ejokliker.firebaseapp.com",
  projectId: "ejokliker",
  storageBucket: "ejokliker.firebasestorage.app",
  messagingSenderId: "625545140275",
  appId: "1:625545140275:web:5267a824c4c319b830eb46",
  measurementId: "G-JQ93QGPLXC"
};

let clicks = 0
let clickPower = 1
let egos = 0

if (localStorage.getItem("clicks")) {
    clicks = parseFloat(localStorage.getItem("clicks"));
    document.getElementById("currency").innerHTML = clicks.toFixed(1);
}

 if (localStorage.getItem("egos")) {
    egos = parseFloat(localStorage.getItem("egos"));
    document.getElementById("ego").innerHTML = egos.toFixed(1);
} 

function money() {
    clicks = clicks + clickPower;
    let niepowienm = clicks.toFixed(1);
    document.getElementById("currency").innerHTML = niepowienm;

    localStorage.setItem("clicks", clicks);
}

  function ego() {
    if (clicks >= 50) {
       clicks -= 50;
       document.getElementById("currency").innerHTML = clicks.toFixed(1);
       egos += 1;
       document.getElementById("ego").innerHTML = egos.toFixed(1);
    }

    localStorage.setItem("egos", egos);
}

function egoPlus() {
    if (egos >= 1) {
        clicks = clicks + (egos * 2);
       document.getElementById("currency").innerHTML = clicks.toFixed(1);
       localStorage.setItem("clicks", clicks);
    }
} 

setInterval(egoPlus, 5000); 
async function wczytajLd() {
    const lista = document.getElementById("lista");
    if (!lista) return;
    
    lista.innerHTML = "<li>Ładowanie leaderboardu...</li>";

    if (!window.db) {
        lista.innerHTML = "<li>Firebase nie jest zainicjowany</li>";
        return;
    }

    try {
        const { collection, getDocs, query, orderBy, limit } = 
            await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js");

        const q = query(
            collection(window.db, "ld"),
            orderBy("clicks", "desc"),
            limit(10)
        );

        const snapshot = await getDocs(q);

        lista.innerHTML = "";

        console.log("Liczba dokumentów:", snapshot.size);   // ← ważne do debugu

        if (snapshot.empty) {
            lista.innerHTML = "<li>Brak wyników na leaderboardzie</li>";
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const li = document.createElement("li");
            li.textContent = `${data.nick || "?"} — ${Math.floor(data.clicks || 0)} ejo`;
            lista.appendChild(li);
        });

    } catch (err) {
        console.error("Błąd przy wczytywaniu ld:", err);
        lista.innerHTML = `<li>Błąd: ${err.message}</li>`;
    }
}

async function leaderboard(){
    const nickname = document.getElementById("nickname").value.trim();
    if (!nickname) return alert("podaj nick");

    const { collection, setDoc, query, where, getDocs, doc } = await import(
        "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js"   
    );

    try {
        const q = query(
            collection(window.db, "ld"),
            where("nick", "==", nickname)
        )

        const snapshot = await getDocs(q);
        let docRef;

        if (!snapshot.empty) {
            const existingDoc = snapshot.docs[0];
            docRef = doc(window.db, "ld", existingDoc.id);
        } else {
            docRef = doc(window.db, "ld", nickname);
        }
        await setDoc(docRef, {
            nick: nickname,
            clicks: clicks,
            ego: egos,
            time: Date.now()

        });
        
    } catch(error) {
        console.error("Błąd zapisu:", error);
        alert("blad zapisu");
    }

    console.log("Próba zapisu:", nickname, clicks, egos);
    await wczytajLd();

}

window.onload = () => {
  wczytajLd();

// Przypisanie zdarzeń JavaScript zamiast inline onclick w HTML
document.getElementById("clicks").addEventListener("click", money);
document.getElementById("kupEgo").addEventListener("click", ego);
document.getElementById("zapiszBtn").addEventListener("click", leaderboard);
};

// Zapis
//    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

