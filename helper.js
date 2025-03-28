import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Load donations and categorize them by status
async function loadDonations() {
    let pendingContainer = document.getElementById("donationList");
    let acceptedContainer = document.getElementById("acceptedDonations");
    let rejectedContainer = document.getElementById("rejectedDonations");

    onSnapshot(collection(db, "donations"), (snapshot) => {
        pendingContainer.innerHTML = "";
        acceptedContainer.innerHTML = "";
        rejectedContainer.innerHTML = "";

        snapshot.forEach((docSnap) => {
            let data = docSnap.data();
            let donationId = docSnap.id;
            let item = document.createElement("div");
            item.className = "donation-item";

            item.innerHTML = `
                <strong>📞 Phone:</strong> ${data.phone} <br>
                <strong>🍽 Food:</strong> ${data.foodType} <br>
                <strong>📦 Quantity:</strong> ${data.quantity} <br>
                <strong>📍 Place:</strong> ${data.place} <br>
                <strong>⏰ Time:</strong> ${new Date(data.time).toLocaleString()} <br>
            `;

            if (data.status === "Pending") {
                // For pending donations, show Accept and Reject buttons
                item.innerHTML += `
                    <button class="accept-btn" onclick="updateStatus('${donationId}', 'Accepted')">✅ Accept</button>
                    <button class="reject-btn" onclick="updateStatus('${donationId}', 'Rejected')">❌ Ignore</button>
                `;
                pendingContainer.appendChild(item);
            } else {
                // For Accepted or Rejected donations, show Delete button
                item.innerHTML += `
                    <strong>Status:</strong> ${data.status} <br>
                    <button class="delete-btn" onclick="deleteDonation('${donationId}')">🗑️ Delete</button>
                `;
                if (data.status === "Accepted") {
                    acceptedContainer.appendChild(item);
                } else if (data.status === "Rejected") {
                    rejectedContainer.appendChild(item);
                }
            }
        });
    });
}

// Update donation status
async function updateStatus(donationId, status) {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, { status });

    // Reload donations to reflect updated status
    loadDonations();
}

// Delete a donation from Firestore
async function deleteDonation(donationId) {
    const donationRef = doc(db, "donations", donationId);
    await deleteDoc(donationRef);

    // Reload donations to remove the deleted item
    loadDonations();
}

// Load donations on page load
window.onload = loadDonations;
window.updateStatus = updateStatus;
window.deleteDonation = deleteDonation;
