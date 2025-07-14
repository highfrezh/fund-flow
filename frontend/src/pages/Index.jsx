import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom';

const Index = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
    <Navbar/>
    <main className="flex-1">
      <div className="min-h-[86vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
          <br />
       
          Take control of your money with <span className="text-gray-800">FundFlow</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Track your expenses, set smart budgets, and receive AI-powered spending insights — all in one simple dashboard.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md">
            Get Started Free
          </Link>
          <Link to="/login" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium px-6 py-3 rounded-md">
            Login
          </Link>
        </div>

        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Hero, Features, Testimonials here */}
          {/* Features Grid */}
          <section className="mt-20 max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Why Choose FundFlow?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-blue-600 text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-lg">Smart Spending Insights</h3>
                <p className="text-gray-600 text-sm mt-2">AI helps you understand where your money really goes every week.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-blue-600 text-4xl mb-3">💡</div>
                <h3 className="font-semibold text-lg">Simple Budgeting</h3>
                <p className="text-gray-600 text-sm mt-2">Set monthly goals, track progress, and get alerts before you overspend.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-blue-600 text-4xl mb-3">📥</div>
                <h3 className="font-semibold text-lg">PDF Reports</h3>
                <p className="text-gray-600 text-sm mt-2">Download summaries for your records or share them easily.</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mt-20 bg-white py-12 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">What Our Users Say</h2>
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded shadow text-sm">
                <p className="text-gray-700 italic">“FundFlow helped me finally understand my spending habits. It’s like having a money coach!”</p>
                <div className="mt-4 font-semibold text-blue-600">— Sarah M.</div>
              </div>
              <div className="bg-gray-50 p-5 rounded shadow text-sm">
                <p className="text-gray-700 italic">“I used to forget where my money went. Now I set budgets and actually stick to them.”</p>
                <div className="mt-4 font-semibold text-blue-600">— James K.</div>
              </div>
              <div className="bg-gray-50 p-5 rounded shadow text-sm">
                <p className="text-gray-700 italic">“The weekly AI insights are 🔥. It tells me when I overspend and gives real advice.”</p>
                <div className="mt-4 font-semibold text-blue-600">— Amina R.</div>
              </div>
            </div>
          </section>


        </div>
      </div>
    </div>
    </main>
    
    <Footer/>
    </div>
  )
}

export default Index