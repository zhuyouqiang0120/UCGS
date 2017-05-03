/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-7-9 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.response;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import com.jfinal.core.Controller;
import com.jfinal.kit.StrKit;
import com.jfinal.render.Render;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年7月9日下午2:53:29
 * @remark
 */
public class MyCaptcha extends Render {

	private static final int WIDTH = 100, HEIGHT = 35;
	private static final String[] strArr = {"3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"};
	
	private String randomCodeKey;
	private int[] bgColor;
	private int[] fontColor;
	
	public MyCaptcha(String randomCodeKey,int[] bgColor,int[] fontColor) {
		if (StrKit.isBlank(randomCodeKey))
			throw new IllegalArgumentException("randomCodeKey can not be blank");
		this.randomCodeKey = randomCodeKey;
		this.bgColor = bgColor;
		this.fontColor = fontColor;
	}
	
	public void render() {
		BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
		String vCode = drawGraphic(image);
		vCode = encrypt(vCode);
		Cookie cookie = new Cookie(randomCodeKey, vCode);
		cookie.setMaxAge(-1);
		cookie.setPath("/");
		response.addCookie(cookie);
		response.setHeader("Pragma","no-cache");
        response.setHeader("Cache-Control","no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/jpeg");
        
        ServletOutputStream sos = null;
        try {
			sos = response.getOutputStream();
			ImageIO.write(image, "jpeg",sos);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			if (sos != null)
				try {sos.close();} catch (IOException e) {e.printStackTrace();}
		}
	}

	private String drawGraphic(BufferedImage image){
		Graphics g = image.createGraphics();
		Random random = new Random();
		g.setColor(new Color(bgColor[0],bgColor[1],bgColor[2]));
		g.fillRect(0, 0, WIDTH, HEIGHT);
		
		g.setFont(new Font("Times New Roman", Font.CENTER_BASELINE, 12));
		for(int i = 0;i < 12;i++){
			g.setColor(new Color(190, 190, 190));
			g.drawString(strArr[random.nextInt(strArr.length)],random.nextInt(WIDTH), random.nextInt(HEIGHT));
		}
		
		String sRand = "";
		g.setFont(new Font("Times New Roman", Font.CENTER_BASELINE, 22));
		for (int i = 0; i < 4; i++) {
			String rand = String.valueOf(strArr[random.nextInt(strArr.length)]).toLowerCase();
			sRand += rand;
			g.setColor(new Color(fontColor[0],fontColor[1],fontColor[2]));
			g.drawString(rand, 15 * i + 22, 24);
		}
		
		
		g.dispose();
		
		return sRand;
	}
	
	@SuppressWarnings("unused")
	private Color getRandColor(int fc, int bc) {
		Random random = new Random();
		if (fc > 255)
			fc = 255;
		if (bc > 255)
			bc = 255;
		int r = fc + random.nextInt(bc - fc);
		int g = fc + random.nextInt(bc - fc);
		int b = fc + random.nextInt(bc - fc);
		return new Color(r, g, b);
	}
	
	private static final String encrypt(String srcStr) {
		try {
			String result = "";
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] bytes = md.digest(srcStr.getBytes("utf-8"));
			for(byte b:bytes){
				String hex = Integer.toHexString(b&0xFF).toUpperCase();
				result += ((hex.length() ==1 ) ? "0" : "") + hex;
			}
			return result;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public static boolean validate(Controller controller, String inputRandomCode, String randomCodeKey) {
		if (StrKit.isBlank(inputRandomCode))
			return false;
		try {
			inputRandomCode = encrypt(inputRandomCode);
			return inputRandomCode.equals(controller.getCookie(randomCodeKey));
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
