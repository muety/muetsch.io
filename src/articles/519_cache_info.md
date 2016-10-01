## Linux – Cache information bash script
February 27, 2015

This is a little bash script to get the CPU cache ratios on Ubuntu.

```
Cache Level: (1, 2 or 3)
Cache Type: (data-, instruction or general cache)
Capacity: of the respective cache
Associativity: (set size)
Block capacity: / capacity of a cache line
Number of sets: ((total capacity / block capacity) / associativity)
```

Concerning the associativity, see [https://en.wikipedia.org/wiki/CPU_cache#Associativity](https://en.wikipedia.org/wiki/CPU_cache#Associativity).

```bash
for DIR0 in /sys/devices/system/cpu/cpu0/cache/*
    do
        LEVEL0=$(sudo cat $DIR0\/level)
        TYPE0=$(sudo cat $DIR0\/type)
        SIZE0=$(sudo cat $DIR0\/size)
        ASSOC0=$(sudo cat $DIR0\/ways_of_associativity)
        BLOCK0=$(sudo cat $DIR0\/coherency_line_size)
        SETS0=$(sudo cat $DIR0\/number_of_sets)

        printf &quot;Cache level: %s\nCache type: %s\nCapacity: %s Bytes\nAssociativity: %s\nSets: %s\nBlock size: %s Bytes\n\n&quot; &quot;$LEVEL0&quot; &quot;$TYPE0&quot; &quot;$SIZE0&quot; &quot;$ASSOC0&quot; &quot;$SETS0&quot; &quot;$BLOCK0&quot;
done
```

**Usage:**

1.  Save code to file, e.g. _~/cacheinfo.sh_
2.  Make it executable: _chmod +x cacheinfo.sh_
3.  Execute: _sudo sh cacheinfo.sh_
