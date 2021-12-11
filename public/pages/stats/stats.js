fetch("/stats/rtp-score/")
    .then(response => response.json())
    .then(( stats ) => {
        const postsTable = document.getElementById("stats-tbody");

        stats.map((statLine, index) => {
            let row = postsTable.insertRow(index)
            statLine.avatarURL ?
                row.insertCell(0).innerHTML = `<img id=avatar src="${statLine.avatarURL}">`
                :
                row.insertCell(0).innerHTML = `<p></p>`
            row.insertCell(1).innerHTML = `<p id="sleeper_username">${escapeHTML(statLine.sleeper_username)}</p></td>`
            row.insertCell(2).innerHTML = `<p id="rtp_score">${statLine.rtp_score}</p></td>`
            row.insertCell(3).innerHTML = `<p id="wins">${statLine.wins}</p></td>`
            row.insertCell(4).innerHTML = `<p id="second_place">${statLine.second_place}</p></td>`
            row.insertCell(5).innerHTML = `<p id="third_place">${statLine.third_place}</p></td>`
            row.insertCell(6).innerHTML = `<p id="playoff_appearances">${statLine.playoff_appearances}</p></td>`
            row.insertCell(7).innerHTML = `<p id="toilet_wins">${statLine.toilet_wins}</p></td>`
            row.insertCell(8).innerHTML = `<p id="pinks">${statLine.pinks}</p></td>`
        });

        sortTable(2)
        sortTable(2)
    });



function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("stats-table");
    switching = true;
    dir = "asc";



    while (switching) {
        switching = false;
        rows = table.rows;

        // Coloring
        rows[1].className = ""
        rows[2].className = ""
        rows[3].className = ""
        rows[10].className = ""
        rows[11].className = ""
        rows[12].className = ""

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    if (dir === "desc") {
        rows[1].className = "first"
        rows[2].className = "second"
        rows[3].className = "third"
        rows[12].className = "last"
    } else {
        rows[12].className = "first"
        rows[11].className = "second"
        rows[10].className = "third"
        rows[1].className = "last"
    }
}
