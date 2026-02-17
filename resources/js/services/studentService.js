export async function fetchStudentById(idNo) {
    const res = await fetch(
        `/security/get-user-details?user_id_no[]=${idNo}`
    );

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
    return data[0] ?? null;
}
