import User from '../models/user.model.js'
import fs from 'fs'
import axios from 'axios'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Helper — extract text from PDF file
const extractPDFText = (filePath) => {
  return new Promise((resolve, reject) => {
    const PDFParser = require('pdf2json')
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const text = pdfData.Pages.map(page =>
  page.Texts.map(t => {
    try {
      return decodeURIComponent(t.R.map(r => r.T).join(''))
    } catch {
      return t.R.map(r => r.T).join('')
    }
  }).join(' ')
).join('\n')
        resolve(text)
      } catch (err) {
        reject(err)
      }
    })

    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err)
    })

    pdfParser.loadPDF(filePath)
  })
}

// ── GET /api/users/profile ──────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── PUT /api/users/profile ──────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, target_role } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, target_role },
      { new: true, runValidators: true }
    )
    res.status(200).json({ success: true, message: 'Profile updated', user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── POST /api/users/analyze-resume ─────────────────────
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      })
    }

    // Step 1 — Extract readable text from the PDF
    let resumeText = ''
    try {
      resumeText = await extractPDFText(req.file.path)
    } catch (pdfErr) {
      console.error('PDF extraction error:', pdfErr.message)
    }

    // Clean up temp file
    try {
      fs.unlinkSync(req.file.path)
    } catch (e) {}

    // Step 2 — Validate extracted text
    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: 'Could not read text from your PDF. Make sure it is not a scanned image — try copying text from the PDF first to verify.'
      })
    }

    console.log('Extracted resume text length:', resumeText.length)
    console.log('First 200 chars:', resumeText.slice(0, 200))

    // Step 3 — Send extracted text to OpenRouter AI
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: `You are an expert career advisor specializing in IT and technology careers. Carefully analyze the following resume text and suggest the top 3 most suitable job roles for this candidate.

Consider their skills, education, certifications, projects, and experience when making suggestions. Focus on IT, software, data, and technology roles if relevant.

Resume text:
${resumeText.slice(0, 3000)}

Respond ONLY with a valid JSON array. No extra text, no markdown, no code blocks, no explanation. Just the raw JSON:
[
  { "role": "Role Name", "reason": "One specific sentence explaining why this role fits based on their resume" },
  { "role": "Role Name", "reason": "One specific sentence explaining why this role fits based on their resume" },
  { "role": "Role Name", "reason": "One specific sentence explaining why this role fits based on their resume" }
]`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Interview Coach'
        }
      }
    )

    // Step 4 — Parse AI response
    let responseText = response.data.choices[0].message.content.trim()

    // Remove markdown code blocks if AI wraps response
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Extract JSON array if there's extra text around it
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      responseText = jsonMatch[0]
    }

    const suggestions = JSON.parse(responseText)

    // Step 5 — Save resume filename to user profile
    await User.findByIdAndUpdate(req.user._id, {
      resume_url: req.file.originalname
    })

    res.status(200).json({ success: true, suggestions })

  } catch (error) {
    console.error('Resume analysis error:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume. Try again.'
    })
  }
}

// ── PUT /api/users/set-role ─────────────────────────────
export const setRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      })
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { target_role: role },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: 'Role updated',
      user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}