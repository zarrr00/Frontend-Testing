import API from "./api"

export const getTransactions = async () => {
  try {
    const res = await API.get("/transactions")
    return res.data
  } catch (error) {
    console.error("Error fetch transactions:", error)
    throw error
  }
}