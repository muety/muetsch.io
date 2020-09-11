#!/bin/bash

IMAGE_PATH="./source/images"

check_cwebp () {
	echo "Checking presence of cwebp"
	if ! command -v cwebp &> /dev/null
	then
	    echo "cwebp could not be found"
	    return 1
	fi
	return 0
}

download_cwebp () {
	wget -O /tmp/libwebp.tar.gz https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.1.0-linux-x86-64.tar.gz
	tar xf /tmp/libwebp.tar.gz
	sudo mv /tmp/libwebp-1.1.0-linux-x86-64/bin/cwebp /usr/local/bin
}

convert_webp () {
	echo "Converting images"

	if ! [ -d /tmp/backup ]; then
		mkdir /tmp/backup
	fi

	shopt -s nocasematch
	
	for e in "$IMAGE_PATH"/*
	do
		if [[ "$e" =~ ^(.+)\.(png|jpg|jpeg)$ ]]; then
			echo "Processing $e."
			file="$(basename $e)"
			filepath="${BASH_REMATCH[1]}"

			cwebp -q 90 "$e" -o "$filepath.webp" &> /dev/null

			echo "Moving $e to /tmp/backup/$file"
			mv "$e" "/tmp/backup/$file"

			echo ""
		fi
	done

	shopt -u nocasematch
}

print_next () {
	echo -e "\n\nDone!\n\nNext steps:\n1. Open your editor and regex-replace \"(images\/)(.+)\.(png|jpg|jpeg)\" with \"\$1\$2.webp\" (because regexes in 'sed' suck).\n2. Be happy."
}

check_cwebp

if [[ "$?" == 1 ]]; then
	echo "Downloading WebP encoder"
	download_cwebp
fi

convert_webp

print_next