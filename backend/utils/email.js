import nodemailer from 'nodemailer'

export const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		host: process.env.HOST,
		port: process.env.EPORT,
		auth: {
			user: process.env.USER,
			pass: process.env.PASS
		}
	})
	const info = await transporter.sendMail({
		from: process.env.USER,
		to: options.to,
		subject: options.subject,
		text: options.text
	})
	console.log(info)
}