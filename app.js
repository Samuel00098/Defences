
const channelId = '2476892';
const apiKey = 'A0DB3CJA4Y88YB8E';
const write_apiKey = '47TK0B4S9KFXZGTD';


// Fetch the data and update the table
function updateTable() {
    const clearedTimestamp = localStorage.getItem('clearedTimestamp');
    fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('data');
            // Clear the table before adding new data
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            data.feeds.forEach(feed => {
                // Convert the feed's timestamp to a Date object
                const feedTimestamp = new Date(feed.created_at);
            const formattedTimestamp = `${feedTimestamp.toLocaleDateString()} ${feedTimestamp.toLocaleTimeString()}`;

            if (feed.field1 !== 'null' && (clearedTimestamp === null || feedTimestamp > new Date(clearedTimestamp))) {
                const row = table.insertRow(-1);
                    const timestampCell = row.insertCell(0);
                    const rfidCell = row.insertCell(1);
                    timestampCell.textContent = feedTimestamp.toLocaleString().replace(',', ' -'); 
                    rfidCell.textContent = feed.field1; 
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

updateTable();
setInterval(updateTable, 1000);

// Save the table 
document.getElementById('save').addEventListener('click', () => {
    const table = document.getElementById('data');
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].textContent);
        }
        csv.push(row.join(','));
    }
    const blob = new Blob([csv.join('\n')], {type: "text/csv;charset=utf-8"});
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

    // Append the timestamp to the file name
    saveAs(blob, `rfid_data_${timestamp}.csv`);
    localStorage.setItem('tableCleared', 'false'); // Reset the cleared state
});

//clear the table
document.getElementById('clear').addEventListener('click', () => {
    const table = document.getElementById('data');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    localStorage.setItem('tableCleared', 'true'); // Set the cleared state

    // Clear the data from ThingSpeak
    // const writeApiKey = write_apiKey;
    // fetch(`https://api.thingspeak.com/update.json?api_key=${writeApiKey}&field1=null`, {
    //     method: 'POST'
    // })
    // .then(response => response.json())
    // .then(data => console.log('Data cleared from ThingSpeak'))
    // .catch(error => console.error('Error:', error));
    localStorage.setItem('clearedTimestamp', new Date().toISOString());
});