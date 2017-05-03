/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-12 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月12日下午2:14:06
 * @remark
 */
public class TypeConverter {
	private static final int timeStampLen = "2011-01-18 16:18:18".length();
	private static final String timeStampPattern = "yyyy-MM-dd HH:mm:ss";
	private static final String datePattern = "yyyy-MM-dd";
	
	public static final Object convert(Class<?> clazz, String s) throws ParseException {
		if (clazz == String.class) {
			return ("".equals(s) ? null : s);	
		}
		s = s.trim();
		if ("".equals(s)) {
			return null;
		}
		
		Object result = null;
		if (clazz == Integer.class || clazz == int.class) {
			result = Integer.parseInt(s);
		}
		// mysql type: bigint
		else if (clazz == Long.class || clazz == long.class) {
			result = Long.parseLong(s);
		}
		else if (clazz == java.util.Date.class) {
        	if (s.length() >= timeStampLen) {
        		result = new SimpleDateFormat(timeStampPattern).parse(s);
        	}
			else {
				result = new SimpleDateFormat(datePattern).parse(s);
			}
        }
		// mysql type: date, year
        else if (clazz == java.sql.Date.class) {
        	if (s.length() >= timeStampLen) {	
        		result = new java.sql.Date(new SimpleDateFormat(timeStampPattern).parse(s).getTime());
        	}
        	else {
        		result = new java.sql.Date(new SimpleDateFormat(datePattern).parse(s).getTime());
        	}
        }
		// mysql type: time
        else if (clazz == java.sql.Time.class) {
        	result = java.sql.Time.valueOf(s);
		}
		// mysql type: timestamp, datetime
        else if (clazz == java.sql.Timestamp.class) {
        	result = java.sql.Timestamp.valueOf(s);
		}
		// mysql type: real, double
        else if (clazz == Double.class) {
        	result = Double.parseDouble(s);
		}
		// mysql type: float
        else if (clazz == Float.class) {
        	result = Float.parseFloat(s);
		}
		// mysql type: bit, tinyint(1)
        else if (clazz == Boolean.class) {
        	result = Boolean.parseBoolean(s) || "1".equals(s);
		}
		// mysql type: decimal, numeric
        else if (clazz == java.math.BigDecimal.class) {
        	result = new java.math.BigDecimal(s);
		}
		// mysql type: unsigned bigint
		else if (clazz == java.math.BigInteger.class) {
			result = new java.math.BigInteger(s);
		}
		// mysql type: binary, varbinary, tinyblob, blob, mediumblob, longblob. I have not finished the test.
        else if (clazz == byte[].class) {
			result = s.getBytes();
		}
		else {
			throw new RuntimeException("Con't convert the class");
        }
		
		return result;
	}
}
